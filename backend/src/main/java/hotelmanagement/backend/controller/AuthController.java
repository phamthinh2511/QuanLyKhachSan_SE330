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
    public ApiResponse<String> login(@RequestBody LoginRequest request) {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );


            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getUsername());
            String token = jwtService.generateToken(userDetails);

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
}
