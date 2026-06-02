package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.SudungdichvuRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.service.SudungdichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/serviceusages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SudungdichvuController {
    private final SudungdichvuService sudungdichvuService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<List<SudungdichvuResponseDto>> getAll() {
        return ApiResponse.<List<SudungdichvuResponseDto>>builder()
                .result(sudungdichvuService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.<SudungdichvuResponseDto>builder()
                .result(sudungdichvuService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> create(@RequestBody SudungdichvuRequestDto dto) {
        return ApiResponse.<SudungdichvuResponseDto>builder()
                .code(201)
                .message("Tạo lượt sử dụng dịch vụ thành công")
                .result(sudungdichvuService.create(dto))
                .build();
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> update(
            @PathVariable Integer id,
            @RequestBody SudungdichvuRequestDto dto) {
        return ApiResponse.<SudungdichvuResponseDto>builder()
                .message("Cập nhật lượt sử dụng dịch vụ thành công")
                .result(sudungdichvuService.update(id, dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        sudungdichvuService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa lượt sử dụng dịch vụ thành công")
                .build();
    }
}
