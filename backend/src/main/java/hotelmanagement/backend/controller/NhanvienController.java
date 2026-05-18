package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.NhanvienRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.NhanvienResponseDto;
import hotelmanagement.backend.service.NhanvienService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
public class NhanvienController {

    private final NhanvienService nhanvienService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<NhanvienResponseDto>> getAll() {
        return ApiResponse.<List<NhanvienResponseDto>>builder()
                .result(nhanvienService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.<NhanvienResponseDto>builder()
                .result(nhanvienService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> create(@jakarta.validation.Valid @RequestBody NhanvienRequestDto dto) {
        return ApiResponse.<NhanvienResponseDto>builder()
                .code(201)
                .message("Tạo nhân viên thành công")
                .result(nhanvienService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> update(
            @PathVariable Integer id,
            @jakarta.validation.Valid
            @RequestBody NhanvienRequestDto dto) {
        return ApiResponse.<NhanvienResponseDto>builder()
                .message("Cập nhật thông tin nhân viên thành công")
                .result(nhanvienService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        nhanvienService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa nhân viên thành công")
                .build();
    }
}