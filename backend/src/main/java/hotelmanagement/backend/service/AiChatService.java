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
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AiChatService {

    private final ChatModel chatModel;
    private final PhongRepository phongRepository;
    private final DichvuRepository dichvuRepository;

    /**
     * Nhận câu hỏi từ nhân viên, tích hợp dữ liệu thực tế chi tiết từ Database
     * để làm bối cảnh (RAG nâng cao) và gửi yêu cầu tới Gemini.
     */
    public String generateChatResponse(String employeeQuestion) {
        // Bước A: Lấy thông tin thực tế chi tiết các phòng từ Database (JOIN FETCH)
        List<Phong> allRooms = phongRepository.findAllWithLoaiPhong();
        
        // Tạo chuỗi mô tả chi tiết trạng thái từng phòng
        String roomDetailsPrompt = allRooms.stream()
                .map(p -> String.format("- Phòng %d: Tầng %d, Loại phòng: %s, Sức chứa tối đa: %d người, Đơn giá: %,.0f VND, Trạng thái hiện tại: %s",
                        p.getId(),
                        p.getSoTang(),
                        p.getMaLoaiPhong().getTenLoaiPhong(),
                        p.getMaLoaiPhong().getSucChuaToiDa(),
                        p.getMaLoaiPhong().getDonGia(),
                        p.getTrangThai()
                ))
                .collect(Collectors.joining("\n"));

        // Lấy danh sách tên dịch vụ hiện hành
        List<String> tenDichVuList = dichvuRepository.findAll().stream()
                .map(Dichvu::getTenDichVu)
                .collect(Collectors.toList());
        String danhSachDichVu = String.join(", ", tenDichVuList);

        // Bước B: Xây dựng System Prompt (Bối cảnh hệ thống chi tiết)
        String systemPromptContext = String.format(
                "Bạn là trợ lý ảo nội bộ (AI Assistant) thông minh và thân thiện của Khách Sạn.\n" +
                "Nhiệm vụ của bạn là hỗ trợ nhân viên giải đáp các thông tin vận hành thực tế một cách ngắn gọn, súc tích và chính xác dựa trên dữ liệu thời gian thực bên dưới.\n\n" +
                "DỮ LIỆU THỜI GIAN THỰC CỦA KHÁCH SẠN:\n" +
                "1. DANH SÁCH CHI TIẾT CÁC PHÒNG:\n" +
                "%s\n\n" +
                "2. CÁC DỊCH VỤ KHÁCH SẠN ĐANG KINH DOANH:\n" +
                "- Danh sách dịch vụ: [%s]\n\n" +
                "HÃY LƯU Ý KHI TRẢ LỜI:\n" +
                "- Trả lời trực tiếp, lịch sự, chuyên nghiệp, ngắn gọn.\n" +
                "- Sử dụng danh sách phòng chi tiết ở trên để tự động đếm hoặc lọc thông tin khi nhân viên hỏi (Ví dụ: tính số phòng Deluxe trống, tìm phòng trống cho 4 người, hoặc tra cứu giá phòng).\n" +
                "- Khi tính toán số lượng phòng trống theo loại hoặc sức chứa, hãy kiểm tra kỹ trường 'Trạng thái hiện tại' phải là 'Trống' hoặc các trạng thái trống tương ứng.\n" +
                "- Nếu nhân viên hỏi thông tin nằm ngoài phạm vi dữ liệu được cung cấp ở trên, hãy lịch sự phản hồi rằng bạn chưa có thông tin đó trên hệ thống.",
                roomDetailsPrompt, danhSachDichVu
        );

        // Bước C: Gửi System Prompt và User Prompt qua Spring AI ChatModel đến Gemini
        Message systemMessage = new SystemMessage(systemPromptContext);
        Message userMessage = new UserMessage(employeeQuestion);
        
        Prompt prompt = new Prompt(List.of(systemMessage, userMessage));

        try {
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
