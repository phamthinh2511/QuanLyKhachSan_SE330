package hotelmanagement.backend.security;

import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.repository.TaikhoanRepository;
import hotelmanagement.backend.repository.NhanvienRepository;
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

    @Autowired
    private NhanvienRepository nhanvienRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        Taikhoan taiKhoan = taiKhoanRepository.findByTenDangNhapAndIsDeletedFalse(username)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy hoặc tài khoản đã bị khóa/xóa: " + username));

        // Kiểm tra xem nhân viên liên kết có bị xóa hoặc đã nghỉ việc hay không
        var nvOpt = nhanvienRepository.findByTaikhoanId(taiKhoan.getId());
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
                throw new UsernameNotFoundException("Tài khoản thuộc nhân viên đã nghỉ việc hoặc bị xóa: " + username);
            }
        }

        String tenQuyen = taiKhoan.getLoaiTaiKhoan().toUpperCase();
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(tenQuyen);

        return new User(
                taiKhoan.getTenDangNhap(),
                taiKhoan.getMatKhau(),
                Collections.singletonList(authority)
        );
    }
}