package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.SudungdichvuRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.service.SudungdichvuService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

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
        return ApiResponse.success(sudungdichvuService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(sudungdichvuService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> create(@Valid @RequestBody SudungdichvuRequestDto dto) {
        SudungdichvuResponseDto created = sudungdichvuService.create(dto);
        ApiResponse<SudungdichvuResponseDto> response = ApiResponse.success(created, "Tạo lượt sử dụng dịch vụ thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<SudungdichvuResponseDto> update(
            @PathVariable Integer id,
            @Valid @RequestBody SudungdichvuRequestDto dto) {
        return ApiResponse.success(sudungdichvuService.update(id, dto), "Cập nhật lượt sử dụng dịch vụ thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        sudungdichvuService.delete(id);
        return ApiResponse.success(null, "Xóa lượt sử dụng dịch vụ thành công");
    }
}
