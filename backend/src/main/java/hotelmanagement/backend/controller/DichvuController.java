package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.service.DichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@RequiredArgsConstructor
public class DichvuController {
    private final DichvuService dichvuService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<List<DichvuResponseDto>> getAll() { 
        return ApiResponse.<List<DichvuResponseDto>>builder()
                .result(dichvuService.getAll())
                .build(); 
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<DichvuResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.<DichvuResponseDto>builder()
                .result(dichvuService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<DichvuResponseDto> create(@Valid @RequestBody DichvuRequestDto dto) {
        return ApiResponse.<DichvuResponseDto>builder()
                .code(201)
                .message("Tạo dịch vụ thành công")
                .result(dichvuService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<DichvuResponseDto> update(
            @PathVariable Integer id,
            @Valid @RequestBody DichvuRequestDto dto){
        return ApiResponse.<DichvuResponseDto>builder()
                .message("Cập nhật dịch vụ thành công")
                .result(dichvuService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        dichvuService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa dịch vụ thành công")
                .build();
    }

    @GetMapping("/trash")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<DichvuResponseDto>> getTrashBin() {
        return ApiResponse.<List<DichvuResponseDto>>builder()
                .result(dichvuService.getTrashBin())
                .build();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<DichvuResponseDto> restore(@PathVariable Integer id) {
        return ApiResponse.<DichvuResponseDto>builder()
                .message("Khôi phục dịch vụ thành công")
                .result(dichvuService.restore(id))
                .build();
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> hardDelete(@PathVariable Integer id) {
        dichvuService.hardDelete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa vĩnh viễn dịch vụ thành công")
                .build();
    }
}
