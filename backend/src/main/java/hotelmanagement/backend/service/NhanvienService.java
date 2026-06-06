package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.NhanvienRequestDto;
import hotelmanagement.backend.dto.response.NhanvienResponseDto;
import hotelmanagement.backend.entity.Nhanvien;
import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.enums.TrangThaiNhanVien;
import hotelmanagement.backend.repository.NhanvienRepository;
import hotelmanagement.backend.repository.TaikhoanRepository;
import hotelmanagement.backend.repository.PhieuthuephongRepository;
import hotelmanagement.backend.repository.HoadonRepository;
import hotelmanagement.backend.repository.KiemkephongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NhanvienService {

    private final NhanvienRepository nhanvienRepository;
    private final TaikhoanRepository taikhoanRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final HoadonRepository hoadonRepository;
    private final KiemkephongRepository kiemkephongRepository;
    private final PasswordEncoder passwordEncoder;

    private NhanvienResponseDto toResponseDto(Nhanvien nv) {
        String formattedId = String.format("EMP-%03d", nv.getId());

        return NhanvienResponseDto.builder()
                .id(formattedId)
                .hoTen(nv.getHoTen())
                .ngaySinh(nv.getNgaySinh() != null ? nv.getNgaySinh().toString() : null)
                .soDienThoai(nv.getSoDienThoai())
                .email(nv.getEmail())
                .chucVu(nv.getChucVu())
                .phongBan(nv.getPhongBan())
                .ngayVaoLam(nv.getNgayVaoLam() != null ? nv.getNgayVaoLam().toString() : null)
                .trangThai(nv.getTrangThai())
                .tenDangNhap(nv.getTaikhoan() != null ? nv.getTaikhoan().getTenDangNhap() : null)
                .loaiTaiKhoan(nv.getTaikhoan() != null ? nv.getTaikhoan().getLoaiTaiKhoan() : null)
                .build();
    }

    private void applyRequestDto(Nhanvien nv, NhanvienRequestDto dto) {
        nv.setHoTen(dto.getHoTen());
        nv.setNgaySinh(dto.getNgaySinh() != null ? LocalDate.parse(dto.getNgaySinh()) : null);
        nv.setSoDienThoai(dto.getSoDienThoai());
        nv.setEmail(dto.getEmail());
        nv.setChucVu(dto.getChucVu());
        nv.setPhongBan(dto.getPhongBan());
        nv.setNgayVaoLam(dto.getNgayVaoLam() != null ? LocalDate.parse(dto.getNgayVaoLam()) : null);
        nv.setTrangThai(dto.getTrangThai());
    }

    public List<NhanvienResponseDto> getAll() {
        return nhanvienRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public NhanvienResponseDto getById(Integer id) {
        Nhanvien nv = nhanvienRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        return toResponseDto(nv);
    }

    public NhanvienResponseDto create(NhanvienRequestDto dto) {
        if (nhanvienRepository.existsBySoDienThoaiAndIsDeletedFalse(dto.getSoDienThoai())) {
            throw new RuntimeException("So dien thoai da ton tai");
        }
        
        Taikhoan tk = null;
        if (dto.getTenDangNhap() != null && !dto.getTenDangNhap().trim().isEmpty()) {
            if (taikhoanRepository.existsByTenDangNhapAndIsDeletedFalse(dto.getTenDangNhap())) {
                throw new RuntimeException("Ten dang nhap da ton tai trong he thong");
            }
            tk = new Taikhoan();
            tk.setTenDangNhap(dto.getTenDangNhap());
            tk.setMatKhau(passwordEncoder.encode(dto.getMatKhau() != null && !dto.getMatKhau().isEmpty() ? dto.getMatKhau() : "123456"));
            tk.setLoaiTaiKhoan(dto.getLoaiTaiKhoan() != null ? dto.getLoaiTaiKhoan() : "USER");
            tk.setNgayTao(LocalDate.now());
            tk = taikhoanRepository.save(tk);
        }

        Nhanvien nv = new Nhanvien();
        nv.setTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC.name());
        applyRequestDto(nv, dto);
        nv.setTaikhoan(tk);
        return toResponseDto(nhanvienRepository.save(nv));
    }

    public NhanvienResponseDto update(Integer id, NhanvienRequestDto dto) {
        Nhanvien nv = nhanvienRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        applyRequestDto(nv, dto);

        if (dto.getTenDangNhap() != null && !dto.getTenDangNhap().trim().isEmpty()) {
            Taikhoan tk = nv.getTaikhoan();
            if (tk == null) {
                if (taikhoanRepository.existsByTenDangNhapAndIsDeletedFalse(dto.getTenDangNhap())) {
                    throw new RuntimeException("Ten dang nhap da ton tai trong he thong");
                }
                tk = new Taikhoan();
                tk.setTenDangNhap(dto.getTenDangNhap());
                tk.setNgayTao(LocalDate.now());
                nv.setTaikhoan(tk);
            } else {
                if (!tk.getTenDangNhap().equals(dto.getTenDangNhap()) && taikhoanRepository.existsByTenDangNhapAndIsDeletedFalse(dto.getTenDangNhap())) {
                    throw new RuntimeException("Ten dang nhap da ton tai trong he thong");
                }
                tk.setTenDangNhap(dto.getTenDangNhap());
            }
            
            tk.setLoaiTaiKhoan(dto.getLoaiTaiKhoan() != null ? dto.getLoaiTaiKhoan() : tk.getLoaiTaiKhoan());
            
            if (dto.getMatKhau() != null && !dto.getMatKhau().trim().isEmpty()) {
                tk.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
            } else if (tk.getId() == null) {
                tk.setMatKhau(passwordEncoder.encode("123456"));
            }
            
            taikhoanRepository.save(tk);
        }

        return toResponseDto(nhanvienRepository.save(nv));
    }

    public void delete(Integer id) {
        Nhanvien nv = nhanvienRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        nv.setIsDeleted(true);
        nv.setDeletedAt(java.time.LocalDateTime.now());
        nv.setTrangThai(TrangThaiNhanVien.NGHI_VIEC.name());
        nhanvienRepository.save(nv);

        if (nv.getTaikhoan() != null) {
            Taikhoan tk = nv.getTaikhoan();
            tk.setIsDeleted(true);
            tk.setDeletedAt(java.time.LocalDateTime.now());
            taikhoanRepository.save(tk);
        }
    }

    public List<NhanvienResponseDto> getTrashBin() {
        return nhanvienRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public NhanvienResponseDto restore(Integer id) {
        Nhanvien nv = nhanvienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        if (!nv.getIsDeleted()) {
            throw new RuntimeException("Nhan vien khong nam trong thung rac");
        }
        nv.setIsDeleted(false);
        nv.setDeletedAt(null);
        nv.setTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC.name());

        if (nv.getTaikhoan() != null) {
            Taikhoan tk = nv.getTaikhoan();
            tk.setIsDeleted(false);
            tk.setDeletedAt(null);
            taikhoanRepository.save(tk);
        }

        return toResponseDto(nhanvienRepository.save(nv));
    }

    public void hardDelete(Integer id) {
        Nhanvien nv = nhanvienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));

        if (phieuthuephongRepository.existsByMaNhanVienId(id) ||
            hoadonRepository.existsByMaNhanVienId(id) ||
            kiemkephongRepository.existsByMaNhanVienId(id)) {
            throw new RuntimeException("Khong the xoa vinh vien nhan vien nay vi ho da co lich su giao dich trong he thong");
        }

        Taikhoan tk = nv.getTaikhoan();
        nhanvienRepository.delete(nv);
        if (tk != null) {
            taikhoanRepository.delete(tk);
        }
    }
}