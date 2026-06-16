package hotelmanagement.backend.controller;


import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DatPhongResponse;
import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import hotelmanagement.backend.entity.Nhanvien;
import hotelmanagement.backend.repository.NhanvienRepository;
import hotelmanagement.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
@PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
public class BookingController {
    @Autowired
    private BookingService bookingService;
    
    @Autowired
    private hotelmanagement.backend.service.BillingService billingService;

    @Autowired
    private NhanvienRepository nhanvienRepository;

    @PostMapping("/submit")
    public ApiResponse<Void> submitBooking(@Valid @RequestBody BookingRequest request) {
        bookingService.xuLyDatHoacThuePhong(request);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Xử lý yêu cầu phòng thành công!")
                .build();
    }
    @PostMapping("/check-in")
    public ApiResponse<PhieuthuephongResponseDto> handleCheckIn(@RequestBody CheckInRequest request) {
        PhieuthuephongResponseDto result = bookingService.checkIn(request);

        return ApiResponse.<PhieuthuephongResponseDto>builder()
                .code(200)
                .message("Nhận phòng (Check-in) thành công!")
                .result(result)
                .build();
    }
    @GetMapping("/all")
    public ApiResponse<List<DatPhongResponse>> getAllBookings() {
        List<DatPhongResponse> list = bookingService.getAllBookings();

        return ApiResponse.<List<DatPhongResponse>>builder()
                .code(200)
                .message("Tải danh sách đặt phòng thành công!")
                .result(list)
                .build();
    }
    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa phiếu đặt phòng và giải phóng phòng thành công!")
                .build();
    }
@PutMapping("/{id}")
public ApiResponse<Void> updateBooking(@PathVariable Integer id, @Valid @RequestBody BookingRequest request) {
    request.setId(id);
    Integer maNhanVien = request.getMaNhanVienId() != null ? request.getMaNhanVienId() : 1;


    bookingService.updateBooking(id, request);
    // bookingService.capNhatTrangThaiNghiepVu(id, request.getTrangThai(), maNhanVien);

    return ApiResponse.<Void>builder()
            .code(200)
            .message("Cập nhật tiến độ trạng thái và giải phóng phòng thành công!")
            .build();
}

    @PostMapping("/check-out")
    public ApiResponse<Void> handleCheckOut(@RequestBody Map<String, Object> request) {
        Integer bookingId = null;
        if (request.get("bookingId") instanceof Number) {
            bookingId = ((Number) request.get("bookingId")).intValue();
        } else if (request.get("bookingId") instanceof String) {
            bookingId = Integer.parseInt((String) request.get("bookingId"));
        }

        String paymentMethod = (String) request.get("paymentMethod");
        if (paymentMethod == null) {
            paymentMethod = "Tiền mặt";
        }

        Integer employeeId = 1;
        try {
            org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                employeeId = nhanvienRepository.findByTaikhoanTenDangNhapAndIsDeletedFalse(auth.getName())
                        .map(Nhanvien::getId)
                        .orElse(1);
            }
        } catch (Exception e) {
            // ignore
        }

        billingService.checkout(hotelmanagement.backend.dto.request.CheckoutRequest.builder()
                .maPhieuThue(bookingId)
                .maNhanVien(employeeId)
                .phuongThucThanhToan(paymentMethod)
                .build());

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Trả phòng (Check-out) và tạo hóa đơn thành công!")
                .build();
    }
}
