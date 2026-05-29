package hotelmanagement.backend.controller;


import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DatPhongResponse;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import hotelmanagement.backend.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/submit")
    public ApiResponse<Void> submitBooking(@Valid @RequestBody BookingRequest request) {
        ApiResponse<Void> response = new ApiResponse<>();
        bookingService.xuLyDatHoacThuePhong(request);

        response.setCode(200);
        response.setMessage("Xử lý yêu cầu phòng thành công!");
        return response;
    }
    @PostMapping("/check-in")
    public ResponseEntity<?> handleCheckIn(@RequestBody CheckInRequest request) {
        try {
            Phieuthuephong result = bookingService.checkIn(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/all")
    public ResponseEntity<java.util.List<DatPhongResponse>> getAllBookings() {
        // Bạn có thể gọi trực tiếp Repository hoặc qua Service nếu đã viết hàm findAll
        return ResponseEntity.ok(bookingService.getAllBookings());
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        try {
            bookingService.deleteBooking(id);
            // Trả về cấu trúc JSON đồng bộ với ApiResponse ở Frontend (code: 200)
            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "Xóa phiếu đặt phòng và giải phóng phòng thành công!");
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "Lỗi hệ thống khi thực hiện xóa phiếu đặt phòng.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Integer id, @RequestBody BookingRequest request) {
        try {
            bookingService.updateBooking(id, request);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "Cập nhật dữ liệu đơn đặt phòng và bảng chi tiết thành công!");
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 500);
            response.put("message", "Lỗi máy chủ khi xử lý cập nhật đơn phòng.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @PostMapping("/check-out")
    public ResponseEntity<?> handleCheckOut(@RequestBody Map<String, Integer> request) {
        try {
            Integer bookingId = request.get("bookingId");
            bookingService.checkOut(bookingId);

            Map<String, Object> response = new HashMap<>();
            response.put("code", 200);
            response.put("message", "Trả phòng (Check-out) và tạo hóa đơn thành công!");
            return ResponseEntity.ok(response);
        } catch (IllegalStateException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 400);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("code", 550);
            response.put("message", "Lỗi hệ thống khi thực hiện Check-out.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}
