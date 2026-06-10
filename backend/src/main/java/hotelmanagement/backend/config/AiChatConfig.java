package hotelmanagement.backend.config;

import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.repository.DatphongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Function;

@Configuration
public class AiChatConfig {

    public record RoomAvailabilityRequest(String checkIn, String checkOut) {}
    public record RoomAvailabilityResponse(List<String> availableRooms) {}

    /**
     * Bean Function Calling hỗ trợ tra cứu phòng trống theo khoảng thời gian thực tế trong Database.
     */
    @Bean
    @Description("Tra cứu danh sách các phòng còn trống trong khách sạn theo khoảng ngày Check-In (ngày nhận phòng) và Check-Out (ngày trả phòng). Yêu cầu định dạng ngày gửi lên là YYYY-MM-DD.")
    public Function<RoomAvailabilityRequest, RoomAvailabilityResponse> checkRoomAvailabilityFunction(
            PhongRepository phongRepository,
            DatphongRepository datphongRepository) {
        return request -> {
            try {
                LocalDate checkIn = LocalDate.parse(request.checkIn());
                LocalDate checkOut = LocalDate.parse(request.checkOut());

                // Lấy danh sách ID các phòng đã được đặt trùng lịch trong khoảng này
                List<Integer> bookedRoomIds = datphongRepository.findBookedRoomIds(checkIn, checkOut);

                List<Phong> availableRooms;
                if (bookedRoomIds == null || bookedRoomIds.isEmpty()) {
                    availableRooms = phongRepository.findAllWithLoaiPhong().stream()
                            .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                            .toList();
                } else {
                    availableRooms = phongRepository.findAllWithLoaiPhong().stream()
                            .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                            .filter(p -> !bookedRoomIds.contains(p.getId()))
                            .toList();
                }

                List<String> roomDetails = availableRooms.stream()
                        .map(p -> String.format("Phòng %d: Tầng %d, Loại phòng: %s, Sức chứa tối đa: %d người, Đơn giá: %,.0f VND",
                                p.getId(),
                                p.getSoTang(),
                                p.getMaLoaiPhong().getTenLoaiPhong(),
                                p.getMaLoaiPhong().getSucChuaToiDa(),
                                p.getMaLoaiPhong().getDonGia()))
                        .toList();

                return new RoomAvailabilityResponse(roomDetails);
            } catch (Exception e) {
                return new RoomAvailabilityResponse(List.of("Đã xảy ra lỗi khi kiểm tra phòng trống: " + e.getMessage()));
            }
        };
    }
}
