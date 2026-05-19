package hotelmanagement.backend.controller;


import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import hotelmanagement.backend.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping("/create")
    public ApiResponse<Datphong> createBooking(@RequestBody BookingRequest request){

        ApiResponse<Datphong> response = new ApiResponse<>();

        try{
            Datphong result = bookingService.createBooking(request);
            response.setResult(result);
        } catch (RuntimeException e) {
            response.setCode(400);
            response.setMessage(e.getMessage());
        }
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
    public ResponseEntity<java.util.List<Datphong>> getAllBookings() {
        // Bạn có thể gọi trực tiếp Repository hoặc qua Service nếu đã viết hàm findAll
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer id) {
        try {
            bookingService.deleteBooking(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ApiResponse<Datphong> updateBooking(@PathVariable Integer id, @RequestBody BookingRequest request) {
        ApiResponse<Datphong> response = new ApiResponse<>();
        try {
            Datphong result = bookingService.updateBooking(id, request);
            response.setResult(result);
        } catch (RuntimeException e) {
            response.setCode(400);
            response.setMessage(e.getMessage());
        }
        return response;
    }

}
