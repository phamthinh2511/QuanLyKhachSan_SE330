package hotelmanagement.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private hotelmanagement.backend.repository.NhanvienRepository nhanvienRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                logger.error("JWT Token error: " + e.getMessage());
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            // Kiểm tra xem nhân viên liên kết có bị xóa hoặc đã nghỉ việc hay không
            java.util.Optional<hotelmanagement.backend.entity.Nhanvien> nvOpt = nhanvienRepository.findByTaikhoanTenDangNhapAndIsDeletedFalse(username);
            if (nvOpt.isPresent()) {
                hotelmanagement.backend.entity.Nhanvien nv = nvOpt.get();
                String trangThai = nv.getTrangThai();
                boolean isResigned = trangThai != null && (
                    trangThai.equalsIgnoreCase("NGHI_VIEC") || 
                    trangThai.equalsIgnoreCase("Đã nghỉ việc") ||
                    trangThai.toLowerCase().contains("nghỉ việc") ||
                    trangThai.toLowerCase().contains("nghi_viec")
                );
                if (nv.getIsDeleted() || isResigned) {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.setCharacterEncoding("UTF-8");
                    response.getWriter().write("{\"code\":401,\"message\":\"Tài khoản thuộc nhân viên đã nghỉ việc hoặc bị xóa.\",\"result\":null}");
                    return;
                }
            }

            String role = jwtService.extractRole(token);

            if (role != null) {

                var authorities = java.util.Arrays.stream(role.split(","))
                        .map(org.springframework.security.core.authority.SimpleGrantedAuthority::new)
                        .collect(java.util.stream.Collectors.toList());


                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username,
                        null,
                        authorities
                );

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        filterChain.doFilter(request, response);
    }
}
