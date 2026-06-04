package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.SudungdichvuRequest;
import hotelmanagement.backend.dto.request.KiemkephongRequest;
import hotelmanagement.backend.dto.request.CheckoutRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.SudungdichvuResponse;
import hotelmanagement.backend.dto.response.KiemkephongResponse;
import hotelmanagement.backend.dto.response.CheckoutResponse;
import hotelmanagement.backend.service.BillingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
    public ApiResponse<SudungdichvuResponse> addServiceUsage(@Valid @RequestBody SudungdichvuRequest request) {
        SudungdichvuResponse response = billingService.addServiceUsage(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.<SudungdichvuResponse>builder()
                    .code(400)
                    .message(response.getMessage())
                    .build();
        }
        return ApiResponse.<SudungdichvuResponse>builder()
                .code(200)
                .message(response.getMessage())
                .result(response)
                .build();
    }
    
    /**
     * API 2: Ghi nhận kiểm kê (nếu khách làm hỏng TV, làm mất chìa khóa...)
     * POST /api/billing/record-inspection
     */
    @PostMapping("/record-inspection")
    public ApiResponse<KiemkephongResponse> recordRoomInspection(@RequestBody KiemkephongRequest request) {
        KiemkephongResponse response = billingService.recordRoomInspection(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.<KiemkephongResponse>builder()
                    .code(400)
                    .message(response.getMessage())
                    .build();
        }
        return ApiResponse.<KiemkephongResponse>builder()
                .code(200)
                .message(response.getMessage())
                .result(response)
                .build();
    }
    
    /**
     * API 3: Check-out (API cốt lõi)
     * Hàm này sẽ gom tiền từ CtPhieuthuephong + Sudungdichvu + Kiemkephong
     * để chốt ra tổng tiền và xuất Hóa đơn cuối cùng
     * POST /api/billing/checkout
     */
    @PostMapping("/checkout")
    public ApiResponse<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        CheckoutResponse response = billingService.checkout(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.<CheckoutResponse>builder()
                    .code(400)
                    .message(response.getMessage())
                    .build();
        }
        return ApiResponse.<CheckoutResponse>builder()
                .code(200)
                .message(response.getMessage())
                .result(response)
                .build();
    }
}
