package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.ChangePasswordRequestDto;
import hotelmanagement.backend.dto.request.TaikhoanRequestDto;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.dto.response.TaikhoanResponseDto;
import hotelmanagement.backend.service.TaikhoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class TaikhoanController {

    private final TaikhoanService taikhoanService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<TaikhoanResponseDto>> getAll() {
        return ApiResponse.<List<TaikhoanResponseDto>>builder()
                .result(taikhoanService.getAll())
                .build();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<TaikhoanResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.<TaikhoanResponseDto>builder()
                .result(taikhoanService.getById(id))
                .build();
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<TaikhoanResponseDto> create(@jakarta.validation.Valid @RequestBody TaikhoanRequestDto dto) {
        return ApiResponse.<TaikhoanResponseDto>builder()
                .code(201)
                .message("Tạo tài khoản thành công")
                .result(taikhoanService.create(dto))
                .build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        taikhoanService.delete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa tài khoản thành công")
                .build();
    }

    @GetMapping("/trash")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<List<TaikhoanResponseDto>> getTrashBin() {
        return ApiResponse.<List<TaikhoanResponseDto>>builder()
                .result(taikhoanService.getTrashBin())
                .build();
    }

    @PutMapping("/{id}/restore")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<TaikhoanResponseDto> restore(@PathVariable Integer id) {
        return ApiResponse.<TaikhoanResponseDto>builder()
                .message("Khôi phục tài khoản thành công")
                .result(taikhoanService.restore(id))
                .build();
    }

    @DeleteMapping("/{id}/hard")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> hardDelete(@PathVariable Integer id) {
        taikhoanService.hardDelete(id);
        return ApiResponse.<Void>builder()
                .message("Xóa vĩnh viễn tài khoản thành công")
                .build();
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> changePassword(
            Principal principal,
            @jakarta.validation.Valid
            @RequestBody ChangePasswordRequestDto dto) {


        taikhoanService.changePassword(principal.getName(), dto);

        return ApiResponse.<Void>builder()
                .message("Đổi mật khẩu thành công")
                .build();
    }
}