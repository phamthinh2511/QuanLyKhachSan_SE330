package hotelmanagement.backend.service;

import hotelmanagement.backend.entity.Dichvu;
import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.repository.DichvuRepository;
import hotelmanagement.backend.repository.PhongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatModel;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.google.genai.GoogleGenAiChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final ChatModel chatModel;
    private final PhongRepository phongRepository;
    private final DichvuRepository dichvuRepository;

    @Value("classpath:hotel_rules.md")
    private Resource rulesResource;

    /**
     * Nhận câu hỏi từ nhân viên, kết hợp dữ liệu quy trình tĩnh (RAG) và cấu hình Function Calling (kiểm tra phòng trống).
     */
    public String generateChatResponse(String employeeQuestion) {
        try {
            // 1. Đọc nội dung quy định nghiệp vụ từ file hotel_rules.md
            String rulesContext = "";
            if (rulesResource != null && rulesResource.exists()) {
                rulesContext = StreamUtils.copyToString(rulesResource.getInputStream(), StandardCharsets.UTF_8);
            }

            // 2. Lấy thông tin trạng thái phòng hiện tại để làm bối cảnh phụ
            List<Phong> allRooms = phongRepository.findAllWithLoaiPhong();
            String roomDetailsPrompt = allRooms.stream()
                    .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                    .map(p -> String.format("- Phòng %d: Tầng %d, Loại phòng: %s, Sức chứa tối đa: %d người, Đơn giá: %,.0f VND, Trạng thái hiện tại: %s",
                            p.getId(),
                            p.getSoTang(),
                            p.getMaLoaiPhong().getTenLoaiPhong(),
                            p.getMaLoaiPhong().getSucChuaToiDa(),
                            p.getMaLoaiPhong().getDonGia(),
                            p.getTrangThai()
                    ))
                    .collect(Collectors.joining("\n"));

            // 3. Lấy danh sách dịch vụ hiện hành
            List<String> tenDichVuList = dichvuRepository.findAll().stream()
                    .map(Dichvu::getTenDichVu)
                    .collect(Collectors.toList());
            String danhSachDichVu = String.join(", ", tenDichVuList);

            // 4. Lấy ngày hệ thống hiện hành làm mốc so sánh thời gian cho AI
            String todayStr = LocalDate.now().toString();

            // 5. Xây dựng System Prompt toàn diện
            String systemPromptContext = String.format(
                    "Bạn là trợ lý ảo nội bộ (AI Assistant) thông minh và thân thiện của Khách Sạn.\n" +
                    "Nhiệm vụ của bạn là hỗ trợ nhân viên giải đáp các thông tin vận hành thực tế và hướng dẫn nghiệp vụ.\n\n" +
                    "MỐC THỜI GIAN HỆ THỐNG HIỆN TẠI (HÔM NAY): %s\n\n" +
                    "=== QUY CHẾ VÀ HƯỚNG DẪN NGHIỆP VỤ ===\n" +
                    "%s\n\n" +
                    "=== DỮ LIỆU TRẠNG THÁI PHÒNG HIỆN TẠI ===\n" +
                    "%s\n\n" +
                    "=== DANH SÁCH DỊCH VỤ HIỆN CÓ ===\n" +
                    "- [%s]\n\n" +
                    "HÃY LƯU Ý KHI TRẢ LỜI:\n" +
                    "- Trả lời trực tiếp, lịch sự, chuyên nghiệp và ngắn gọn.\n" +
                    "- Khi khách hỏi về phòng trống trong tương lai (ví dụ: ngày mai, ngày cụ thể), bạn phải sử dụng công cụ/hàm `checkRoomAvailabilityFunction` được cung cấp. Không tự ý suy đoán phòng trống trong tương lai dựa vào trạng thái hiện tại.\n" +
                    "- Nếu thông tin nằm ngoài phạm vi dữ liệu được cung cấp hoặc các công cụ không tra cứu được, hãy lịch sự phản hồi rằng hệ thống chưa ghi nhận thông tin này.",
                    todayStr, rulesContext, roomDetailsPrompt, danhSachDichVu
            );

            // 6. Gửi dữ liệu và cấu hình Function Calling đến Gemini
            Message systemMessage = new SystemMessage(systemPromptContext);
            Message userMessage = new UserMessage(employeeQuestion);

            Prompt prompt = new Prompt(
                    List.of(systemMessage, userMessage),
                    GoogleGenAiChatOptions.builder()
                            .toolNames(Set.of("checkRoomAvailabilityFunction"))
                            .build()
            );

            var chatResponse = chatModel.call(prompt);
            if (chatResponse != null && chatResponse.getResult() != null && chatResponse.getResult().getOutput() != null) {
                return chatResponse.getResult().getOutput().getText();
            }
            return "Xin lỗi, tôi không nhận được phản hồi từ hệ thống AI.";

        } catch (Exception e) {
            return "Đã xảy ra lỗi khi kết nối tới Trí tuệ nhân tạo Gemini: " + e.getMessage();
        }
    }
}
