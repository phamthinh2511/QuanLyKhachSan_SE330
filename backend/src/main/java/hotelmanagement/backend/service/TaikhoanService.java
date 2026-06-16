package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.ChangePasswordRequestDto;
import hotelmanagement.backend.dto.request.TaikhoanRequestDto;
import hotelmanagement.backend.dto.response.TaikhoanResponseDto;
import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.repository.TaikhoanRepository;
import hotelmanagement.backend.repository.NhanvienRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TaikhoanService {

    private final TaikhoanRepository taikhoanRepository;
    private final NhanvienRepository nhanvienRepository;
    private final PasswordEncoder passwordEncoder;

    private TaikhoanResponseDto toResponseDto(Taikhoan tk) {
        return TaikhoanResponseDto.builder()
                .id(tk.getId())
                .username(tk.getTenDangNhap())
                .role(tk.getLoaiTaiKhoan())
                .createdAt(tk.getNgayTao() != null ? tk.getNgayTao().toString() : null)
                .build();
    }

    public List<TaikhoanResponseDto> getAll() {
        return taikhoanRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public TaikhoanResponseDto getById(Integer id) {
        Taikhoan tk = taikhoanRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + id));
        return toResponseDto(tk);
    }

    public TaikhoanResponseDto create(TaikhoanRequestDto dto) {
        if (taikhoanRepository.existsByTenDangNhapAndIsDeletedFalse(dto.getUsername())) {
            throw new RuntimeException("Ten dang nhap da ton tai trong he thong");
        }

        Taikhoan tk = new Taikhoan();
        tk.setTenDangNhap(dto.getUsername());
        tk.setMatKhau(passwordEncoder.encode(dto.getPassword()));
        tk.setLoaiTaiKhoan(dto.getRole());
        tk.setNgayTao(LocalDate.now(java.time.ZoneId.of("Asia/Ho_Chi_Minh")));

        return toResponseDto(taikhoanRepository.save(tk));
    }

    public TaikhoanResponseDto update(Integer id, TaikhoanRequestDto dto) {
        Taikhoan tk = taikhoanRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + id));

        if (!tk.getTenDangNhap().equals(dto.getUsername()) && taikhoanRepository.existsByTenDangNhapAndIsDeletedFalse(dto.getUsername())) {
            throw new RuntimeException("Ten dang nhap da ton tai trong he thong");
        }
        tk.setTenDangNhap(dto.getUsername());
        tk.setLoaiTaiKhoan(dto.getRole());

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            tk.setMatKhau(passwordEncoder.encode(dto.getPassword()));
        }

        return toResponseDto(taikhoanRepository.save(tk));
    }

    public void delete(Integer id) {
        Taikhoan tk = taikhoanRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + id));
        tk.setIsDeleted(true);
        tk.setDeletedAt(java.time.LocalDateTime.now());
        taikhoanRepository.save(tk);
    }

    public List<TaikhoanResponseDto> getTrashBin() {
        return taikhoanRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public TaikhoanResponseDto restore(Integer id) {
        Taikhoan tk = taikhoanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + id));
        if (!tk.getIsDeleted()) {
            throw new RuntimeException("Tai khoan khong nam trong thung rac");
        }
        tk.setIsDeleted(false);
        tk.setDeletedAt(null);
        return toResponseDto(taikhoanRepository.save(tk));
    }

    public void hardDelete(Integer id) {
        Taikhoan tk = taikhoanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + id));

        if (!tk.getIsDeleted()) {
            throw new RuntimeException("Tai khoan khong nam trong thung rac nen khong the xoa vinh vien");
        }

        if (nhanvienRepository.existsByTaikhoanId(id)) {
            throw new RuntimeException("Khong the xoa vinh vien tai khoan nay vi dang lien ket voi nhan vien trong he thong");
        }

        taikhoanRepository.delete(tk);
    }

    public void changePassword(String tenDangNhap, ChangePasswordRequestDto dto) {
        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        Taikhoan tk = taikhoanRepository.findByTenDangNhapAndIsDeletedFalse(tenDangNhap)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản"));

        if (!passwordEncoder.matches(dto.getOldPassword(), tk.getMatKhau())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        tk.setMatKhau(passwordEncoder.encode(dto.getNewPassword()));
        taikhoanRepository.save(tk);
    }
}