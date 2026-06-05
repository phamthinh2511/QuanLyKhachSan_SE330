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
        return ApiResponse.success(taikhoanService.getAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<TaikhoanResponseDto> getById(@PathVariable Integer id) {
        return ApiResponse.success(taikhoanService.getById(id));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<TaikhoanResponseDto> create(@jakarta.validation.Valid @RequestBody TaikhoanRequestDto dto) {
        TaikhoanResponseDto created = taikhoanService.create(dto);
        ApiResponse<TaikhoanResponseDto> response = ApiResponse.success(created, "Tạo tài khoản thành công");
        response.setCode(201);
        return response;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ApiResponse<Void> delete(@PathVariable Integer id) {
        taikhoanService.delete(id);
        return ApiResponse.success(null, "Xóa tài khoản thành công");
    }

    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ApiResponse<Void> changePassword(
            Principal principal,
            @jakarta.validation.Valid
            @RequestBody ChangePasswordRequestDto dto) {
        taikhoanService.changePassword(principal.getName(), dto);
        return ApiResponse.success(null, "Đổi mật khẩu thành công");
    }
}
