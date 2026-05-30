package hotelmanagement.backend.security;

import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.repository.TaikhoanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private TaikhoanRepository taiKhoanRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Taikhoan taiKhoan = taiKhoanRepository.findByTenDangNhap(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy tài khoản: " + username));

        String tenQuyen = taiKhoan.getLoaiTaiKhoan().toUpperCase();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(tenQuyen);

        return new User(
                taiKhoan.getTenDangNhap(),
                taiKhoan.getMatKhau(),
                Collections.singletonList(authority)
        );
    }
}