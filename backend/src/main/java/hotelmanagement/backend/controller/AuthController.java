package hotelmanagement.backend.controller;

import hotelmanagement.backend.dto.request.LoginRequest;
import hotelmanagement.backend.dto.response.ApiResponse;
import hotelmanagement.backend.security.CustomUserDetailsService;
import hotelmanagement.backend.security.JwtService;
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

    @PostMapping("/login")
    public ApiResponse<String> login(@jakarta.validation.Valid @RequestBody LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            String token = jwtService.generateToken(userDetails);

            return ApiResponse.success(token, "Đăng nhập thành công!");

        } catch (Exception e) {
            return ApiResponse.error(401, "Đăng nhập thất bại!");
        }
    }
}
