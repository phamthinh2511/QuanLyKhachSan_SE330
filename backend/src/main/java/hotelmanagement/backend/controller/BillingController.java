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

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {
    
    private final BillingService billingService;
    
    @PostMapping("/add-service")
    public ApiResponse<SudungdichvuResponse> addServiceUsage(@Valid @RequestBody SudungdichvuRequest request) {
        SudungdichvuResponse response = billingService.addServiceUsage(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.error(400, response.getMessage());
        }
        return ApiResponse.success(response, response.getMessage());
    }
    
    @PostMapping("/record-inspection")
    public ApiResponse<KiemkephongResponse> recordRoomInspection(@RequestBody KiemkephongRequest request) {
        KiemkephongResponse response = billingService.recordRoomInspection(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.error(400, response.getMessage());
        }
        return ApiResponse.success(response, response.getMessage());
    }
    
    @PostMapping("/checkout")
    public ApiResponse<CheckoutResponse> checkout(@Valid @RequestBody CheckoutRequest request) {
        CheckoutResponse response = billingService.checkout(request);
        if (response.getMessage() != null && response.getMessage().startsWith("Lỗi")) {
            return ApiResponse.error(400, response.getMessage());
        }
        return ApiResponse.success(response, response.getMessage());
    }
}
