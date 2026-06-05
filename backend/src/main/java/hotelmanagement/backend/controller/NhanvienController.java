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
        return ApiResponse.success(nhanvienService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(nhanvienService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> create(@jakarta.validation.Valid @RequestBody NhanvienRequestDto dto) {
        NhanvienResponseDto created = nhanvienService.create(dto);
        ApiResponse<NhanvienResponseDto> response = ApiResponse.success(created, "Tạo nhân viên thành công");
        response.setCode(201);
        return response;
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<NhanvienResponseDto> update(
            @PathVariable Integer id,
            @jakarta.validation.Valid
            @RequestBody NhanvienRequestDto dto) {
        return ApiResponse.success(nhanvienService.update(id, dto), "Cập nhật thông tin nhân viên thành công");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        nhanvienService.delete(id);
        return ApiResponse.success(null, "Xóa nhân viên thành công");
    }
}
