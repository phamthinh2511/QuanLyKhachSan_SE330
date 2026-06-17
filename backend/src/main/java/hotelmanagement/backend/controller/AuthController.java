package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.ForgotPasswordRequest;
import hotelmanagement.backend.dto.request.LoginRequest;
import hotelmanagement.backend.dto.request.ResetPasswordRequest;
import hotelmanagement.backend.dto.request.VerifyOtpRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.security.CustomUserDetailsService;
import hotelmanagement.backend.security.JwtService;
import hotelmanagement.backend.entity.Nhanvien;
import hotelmanagement.backend.repository.NhanvienRepository;
import hotelmanagement.backend.service.PasswordResetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private NhanvienRepository nhanvienRepository;

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/login")
    public ApiResponse<String> login(@jakarta.validation.Valid @RequestBody LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );


            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            
            Integer employeeId = nhanvienRepository.findByTaikhoanTenDangNhapAndIsDeletedFalse(request.getUsername())
                    .map(Nhanvien::getId)
                    .orElse(null);
            
            String token = jwtService.generateToken(userDetails, employeeId);

            ApiResponse<String> response = new ApiResponse<>();
            response.setCode(200);
            response.setMessage("Đăng nhập thành công!");
            response.setResult(token);

            return response;

        } catch (Exception e) {
            ApiResponse<String> errorResponse = new ApiResponse<>();
            errorResponse.setCode(401);
            errorResponse.setMessage("Đăng nhập thất bại!");
            return errorResponse;
        }

    }

    @PostMapping("/forgot-password")
    public ApiResponse<Void> forgotPassword(@jakarta.validation.Valid @RequestBody ForgotPasswordRequest request) {
        try {
            passwordResetService.generateAndSendOtp(request.getEmail());
            return ApiResponse.<Void>builder()
                    .code(200)
                    .message("Mã OTP đã được gửi đến email của bạn")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .code(400)
                    .message(e.getMessage())
                    .build();
        }
    }

    @PostMapping("/verify-otp")
    public ApiResponse<Void> verifyOtp(@jakarta.validation.Valid @RequestBody VerifyOtpRequest request) {
        try {
            passwordResetService.verifyOtp(request.getEmail(), request.getOtp());
            return ApiResponse.<Void>builder()
                    .code(200)
                    .message("Xác minh OTP thành công")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .code(400)
                    .message(e.getMessage())
                    .build();
        }
    }

    @PostMapping("/reset-password")
    public ApiResponse<Void> resetPassword(@jakarta.validation.Valid @RequestBody ResetPasswordRequest request) {
        try {
            passwordResetService.resetPassword(
                    request.getEmail(),
                    request.getOtp(),
                    request.getNewPassword(),
                    request.getConfirmPassword()
            );
            return ApiResponse.<Void>builder()
                    .code(200)
                    .message("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.")
                    .build();
        } catch (Exception e) {
            return ApiResponse.<Void>builder()
                    .code(400)
                    .message(e.getMessage())
                    .build();
        }
    }
}

