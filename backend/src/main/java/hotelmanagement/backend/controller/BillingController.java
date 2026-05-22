package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.SudungdichvuRequest;
import hotelmanagement.backend.dto.request.KiemkephongRequest;
import hotelmanagement.backend.dto.request.CheckoutRequest;
import hotelmanagement.backend.dto.response.SudungdichvuResponse;
import hotelmanagement.backend.dto.response.KiemkephongResponse;
import hotelmanagement.backend.dto.response.CheckoutResponse;
import hotelmanagement.backend.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller xử lý dịch vụ phát sinh & thanh toán
 * Người 3: Dịch vụ phát sinh & Thanh toán (4 Bảng)
 * Chịu trách nhiệm từ lúc khách đang ở cho đến lúc xách vali rời đi.
 */
@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {
    
    private final BillingService billingService;
    
    /**
     * API 1: Ghi nhận khách gọi thêm dồ ăn, giặt ủi...
     * POST /api/billing/add-service
     */
    @PostMapping("/add-service")
    public ResponseEntity<SudungdichvuResponse> addServiceUsage(@RequestBody SudungdichvuRequest request) {
        try {
            SudungdichvuResponse response = billingService.addServiceUsage(request);
            if (response.getMessage().startsWith("Lỗi")) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(SudungdichvuResponse.builder()
                            .message("Lỗi server: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * API 2: Ghi nhận kiểm kê (nếu khách làm hỏng TV, làm mất chìa khóa...)
     * POST /api/billing/record-inspection
     */
    @PostMapping("/record-inspection")
    public ResponseEntity<KiemkephongResponse> recordRoomInspection(@RequestBody KiemkephongRequest request) {
        try {
            KiemkephongResponse response = billingService.recordRoomInspection(request);
            if (response.getMessage().startsWith("Lỗi")) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(KiemkephongResponse.builder()
                            .message("Lỗi server: " + e.getMessage())
                            .build());
        }
    }
    
    /**
     * API 3: Check-out (API cốt lõi)
     * Hàm này sẽ gom tiền từ CtPhieuthuephong + Sudungdichvu + Kiemkephong
     * để chốt ra tổng tiền và xuất Hóa đơn cuối cùng
     * POST /api/billing/checkout
     */
    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> checkout(@RequestBody CheckoutRequest request) {
        try {
            CheckoutResponse response = billingService.checkout(request);
            if (response.getMessage().startsWith("Lỗi")) {
                return ResponseEntity.badRequest().body(response);
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(CheckoutResponse.builder()
                            .message("Lỗi server: " + e.getMessage())
                            .build());
        }
    }
}
