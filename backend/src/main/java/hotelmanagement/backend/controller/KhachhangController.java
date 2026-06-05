package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.KhachhangRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.KhachhangResponseDto;
import hotelmanagement.backend.service.KhachhangService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class KhachhangController {

    private final KhachhangService khachhangService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<List<KhachhangResponseDto>> getAll() {
        return ApiResponse.success(khachhangService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<KhachhangResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(khachhangService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<KhachhangResponseDto> create(@jakarta.validation.Valid @RequestBody KhachhangRequestDto dto) {
        KhachhangResponseDto created = khachhangService.create(dto);
        ApiResponse<KhachhangResponseDto> response = ApiResponse.success(created, "Tạo khách hàng thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<KhachhangResponseDto> update(
            @PathVariable Integer id,
            @jakarta.validation.Valid
            @RequestBody KhachhangRequestDto dto) {
        return ApiResponse.success(khachhangService.update(id, dto), "Cập nhật khách hàng thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        khachhangService.delete(id);
        return ApiResponse.success(null, "Xóa khách hàng thành công");
    }
}
