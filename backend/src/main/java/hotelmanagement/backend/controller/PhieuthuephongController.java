package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.service.PhieuthuephongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rentals")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PhieuthuephongController {
    private final PhieuthuephongService phieuthuephongService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<List<PhieuthuephongResponseDto>> getAll() {
        List<PhieuthuephongResponseDto> list = phieuthuephongService.getAll();

        return ApiResponse.<List<PhieuthuephongResponseDto>>builder()
                .code(200)
                .message("Tải danh sách phiếu thuê phòng thành công!")
                .result(list) // Đẩy danh sách DTO vào trường result cho Frontend map dữ liệu
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<PhieuthuephongResponseDto> getById(@PathVariable Integer id) {
        PhieuthuephongResponseDto dto = phieuthuephongService.getById(id);

        return ApiResponse.<PhieuthuephongResponseDto>builder()
                .code(200)
                .message("Tải thông tin chi tiết phiếu thuê phòng thành công!")
                .result(dto)
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'NHAN_VIEN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        phieuthuephongService.delete(id);

        return ApiResponse.<Void>builder()
                .code(200)
                .message("Xóa phiếu thuê phòng thành công!")
                .build();
    }
}
