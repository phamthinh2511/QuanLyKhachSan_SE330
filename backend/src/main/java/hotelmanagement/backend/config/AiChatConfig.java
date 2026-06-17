package hotelmanagement.backend.config;

import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.CtDatphong;
import hotelmanagement.backend.entity.Hoadon;
import hotelmanagement.backend.repository.DatphongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import hotelmanagement.backend.repository.CtDatphongRepository;
import hotelmanagement.backend.repository.HoadonRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Description;

import java.time.LocalDate;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

@Configuration
public class AiChatConfig {

    public record RoomAvailabilityRequest(String checkIn, String checkOut) {}
    public record RoomAvailabilityResponse(List<String> availableRooms) {}

    public record BookedRoomsRequest(String checkIn, String checkOut) {}
    public record BookedRoomsResponse(List<String> bookedRooms) {}

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

    /**
     * Bean Function Calling hỗ trợ tra cứu danh sách phòng bận/đã được đặt theo khoảng thời gian thực tế trong Database.
     */
    @Bean
    @Description("Tra cứu danh sách các phòng đã được đặt hoặc đang sử dụng (occupied/booked) trong khách sạn theo khoảng ngày Check-In (ngày nhận phòng) và Check-Out (ngày trả phòng). Yêu cầu định dạng ngày gửi lên là YYYY-MM-DD.")
    public Function<BookedRoomsRequest, BookedRoomsResponse> checkBookedRoomsFunction(
            PhongRepository phongRepository,
            DatphongRepository datphongRepository) {
        return request -> {
            try {
                LocalDate checkIn = LocalDate.parse(request.checkIn());
                LocalDate checkOut = LocalDate.parse(request.checkOut());

                // Lấy danh sách ID các phòng đã được đặt trùng lịch trong khoảng này
                List<Integer> bookedRoomIds = datphongRepository.findBookedRoomIds(checkIn, checkOut);

                if (bookedRoomIds == null || bookedRoomIds.isEmpty()) {
                    return new BookedRoomsResponse(List.of());
                }

                List<Phong> bookedRooms = phongRepository.findAllWithLoaiPhong().stream()
                        .filter(p -> p.getIsDeleted() == null || !p.getIsDeleted())
                        .filter(p -> bookedRoomIds.contains(p.getId()))
                        .toList();

                List<String> roomDetails = bookedRooms.stream()
                        .map(p -> String.format("Phòng %d: Tầng %d, Loại phòng: %s, Sức chứa tối đa: %d người, Đơn giá: %,.0f VND",
                                p.getId(),
                                p.getSoTang(),
                                p.getMaLoaiPhong().getTenLoaiPhong(),
                                p.getMaLoaiPhong().getSucChuaToiDa(),
                                p.getMaLoaiPhong().getDonGia()))
                        .toList();

                return new BookedRoomsResponse(roomDetails);
            } catch (Exception e) {
                return new BookedRoomsResponse(List.of("Đã xảy ra lỗi khi kiểm tra phòng bận: " + e.getMessage()));
            }
        };
    }

    public record BookingInvoiceQueryRequest(String keyword) {}
    public record BookingInvoiceQueryResponse(List<String> bookings, List<String> invoices) {}

    /**
     * Bean Function Calling hỗ trợ tra cứu đơn đặt phòng (booking) hoặc hóa đơn (invoice) của khách hàng.
     */
    @Bean
    @Description("Tra cứu danh sách các đơn đặt phòng (booking) hoặc hóa đơn (invoice) của khách hàng theo từ khóa tìm kiếm (Tên khách hàng, số điện thoại, CCCD, mã đặt phòng hoặc mã hóa đơn).")
    public Function<BookingInvoiceQueryRequest, BookingInvoiceQueryResponse> checkBookingAndInvoiceFunction(
            DatphongRepository datphongRepository,
            HoadonRepository hoadonRepository,
            CtDatphongRepository ctDatphongRepository) {
        return request -> {
            try {
                String keyword = request.keyword().trim().toLowerCase();

                // 1. Tìm kiếm bookings
                List<Datphong> allBookings = datphongRepository.findAll();
                List<String> bookingDetails = allBookings.stream()
                        .filter(dp -> {
                            String idStr = String.valueOf(dp.getId());
                            String khName = dp.getMaKhachHang() != null && dp.getMaKhachHang().getTenKhachHang() != null ? 
                                    dp.getMaKhachHang().getTenKhachHang().toLowerCase() : "";
                            String khPhone = dp.getMaKhachHang() != null && dp.getMaKhachHang().getSoDienThoai() != null ? 
                                    dp.getMaKhachHang().getSoDienThoai() : "";
                            String khCccd = dp.getMaKhachHang() != null && dp.getMaKhachHang().getCccd() != null ? 
                                    dp.getMaKhachHang().getCccd() : "";
                            return idStr.contains(keyword) || 
                                   khName.contains(keyword) || 
                                   khPhone.contains(keyword) || 
                                   khCccd.contains(keyword);
                        })
                        .map(dp -> {
                            List<CtDatphong> chiTiet = ctDatphongRepository.findByMaDatPhong(dp);
                            String rooms = chiTiet.stream()
                                    .map(ct -> String.valueOf(ct.getMaPhong().getId()))
                                    .collect(Collectors.joining(", "));
                            return String.format("Đơn đặt phòng #%d: Khách hàng %s (%s), Ngày nhận: %s, Ngày trả: %s, Trạng thái: %s, Phòng gán: %s",
                                    dp.getId(),
                                    dp.getMaKhachHang() != null ? dp.getMaKhachHang().getTenKhachHang() : "Không rõ",
                                    dp.getMaKhachHang() != null ? dp.getMaKhachHang().getSoDienThoai() : "Không rõ",
                                    dp.getNgayNhan(),
                                    dp.getNgayTra(),
                                    dp.getTrangThai(),
                                    rooms.isEmpty() ? "Chưa gán" : rooms);
                        })
                        .toList();

                // 2. Tìm kiếm invoices
                List<Hoadon> allInvoices = hoadonRepository.findAll();
                List<String> invoiceDetails = allInvoices.stream()
                        .filter(hd -> {
                            String idStr = String.valueOf(hd.getId());
                            String khName = hd.getMaPhieuThue() != null && hd.getMaPhieuThue().getMaKhachHang() != null && hd.getMaPhieuThue().getMaKhachHang().getTenKhachHang() != null ? 
                                    hd.getMaPhieuThue().getMaKhachHang().getTenKhachHang().toLowerCase() : "";
                            String khPhone = hd.getMaPhieuThue() != null && hd.getMaPhieuThue().getMaKhachHang() != null && hd.getMaPhieuThue().getMaKhachHang().getSoDienThoai() != null ? 
                                    hd.getMaPhieuThue().getMaKhachHang().getSoDienThoai() : "";
                            return idStr.contains(keyword) || 
                                   khName.contains(keyword) || 
                                   khPhone.contains(keyword);
                        })
                        .map(hd -> String.format("Hóa đơn #%d: Khách hàng %s, Ngày thanh toán: %s, Tổng tiền: %,.0f VND, Phương thức: %s, Trạng thái: %s",
                                hd.getId(),
                                hd.getMaPhieuThue() != null && hd.getMaPhieuThue().getMaKhachHang() != null ? hd.getMaPhieuThue().getMaKhachHang().getTenKhachHang() : "Không rõ",
                                hd.getNgayThanhToan() != null ? hd.getNgayThanhToan().toString() : "Chưa thanh toán",
                                hd.getTongTien(),
                                hd.getPhuongThucThanhToan() != null ? hd.getPhuongThucThanhToan() : "Chưa xác định",
                                hd.getTrangThai() != null ? hd.getTrangThai() : "Chưa thanh toán"))
                        .toList();

                return new BookingInvoiceQueryResponse(bookingDetails, invoiceDetails);
            } catch (Exception e) {
                return new BookingInvoiceQueryResponse(
                        List.of("Đã xảy ra lỗi khi tìm kiếm đơn đặt phòng: " + e.getMessage()),
                        List.of("Đã xảy ra lỗi khi tìm kiếm hóa đơn: " + e.getMessage())
                );
            }
        };
    }
}
