package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DatPhongResponse;
import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/submit")
    public ApiResponse<Void> submitBooking(@Valid @RequestBody BookingRequest request) {
        bookingService.xuLyDatHoacThuePhong(request);
        return ApiResponse.success(null, "Xử lý yêu cầu phòng thành công!");
    }

    @PostMapping("/check-in")
    public ApiResponse<PhieuthuephongResponseDto> handleCheckIn(@RequestBody CheckInRequest request) {
        PhieuthuephongResponseDto result = bookingService.checkIn(request);
        return ApiResponse.success(result, "Nhận phòng (Check-in) thành công!");
    }

    @GetMapping("/all")
    public ApiResponse<List<DatPhongResponse>> getAllBookings() {
        List<DatPhongResponse> list = bookingService.getAllBookings();
        return ApiResponse.success(list, "Tải danh sách đặt phòng thành công!");
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteBooking(@PathVariable Integer id) {
        bookingService.deleteBooking(id);
        return ApiResponse.success(null, "Xóa phiếu đặt phòng và giải phóng phòng thành công!");
    }

    @PutMapping("/{id}")
    public ApiResponse<Void> updateBooking(@PathVariable Integer id, @Valid @RequestBody BookingRequest request) {
        // Now this method will handle full updates with validation
        bookingService.updateBooking(id, request);
        return ApiResponse.success(null, "Cập nhật thông tin đặt phòng thành công!");
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

        bookingService.checkOut(bookingId, paymentMethod);
        return ApiResponse.success(null, "Trả phòng (Check-out) và tạo hóa đơn thành công!");
    }
}
