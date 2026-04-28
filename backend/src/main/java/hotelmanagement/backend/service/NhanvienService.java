package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.NhanvienRequestDto;
import hotelmanagement.backend.dto.response.NhanvienResponseDto;
import hotelmanagement.backend.entity.Nhanvien;
import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.enums.TrangThaiNhanVien;
import hotelmanagement.backend.repository.NhanvienRepository;
import hotelmanagement.backend.repository.TaikhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NhanvienService {

    private final NhanvienRepository nhanvienRepository;
    private final TaikhoanRepository taikhoanRepository;

    private NhanvienResponseDto toResponseDto(Nhanvien nv) {
        // Format ID thành chuỗi EMP-001, EMP-012...
        String formattedId = String.format("EMP-%03d", nv.getId());

        return NhanvienResponseDto.builder()
                .id(formattedId)
                .hoTen(nv.getHoTen())
                .ngaySinh(nv.getNgaySinh() != null ? nv.getNgaySinh().toString() : null)
                .soDienThoai(nv.getSoDienThoai())
                .email(nv.getEmail()) // Lấy trực tiếp từ bảng Nhanvien
                .chucVu(nv.getChucVu())
                .phongBan(nv.getPhongBan())
                .ngayVaoLam(nv.getNgayVaoLam() != null ? nv.getNgayVaoLam().toString() : null)
                .trangThai(nv.getTrangThai())
                .build();
    }

    private void applyRequestDto(Nhanvien nv, NhanvienRequestDto dto) {
        nv.setHoTen(dto.getHoTen());
        nv.setNgaySinh(dto.getNgaySinh() != null ? LocalDate.parse(dto.getNgaySinh()) : null);
        nv.setSoDienThoai(dto.getSoDienThoai());
        nv.setEmail(dto.getEmail()); // Lưu trực tiếp vào bảng Nhanvien
        nv.setChucVu(dto.getChucVu());
        nv.setPhongBan(dto.getPhongBan());
        nv.setNgayVaoLam(dto.getNgayVaoLam() != null ? LocalDate.parse(dto.getNgayVaoLam()) : null);
        nv.setTrangThai(dto.getTrangThai());

        // Xử lý liên kết tài khoản nếu có
        if (dto.getMaTaiKhoan() != null) {
            Taikhoan tk = taikhoanRepository.findById(dto.getMaTaiKhoan())
                    .orElseThrow(() -> new RuntimeException("Khong tim thay tai khoan id: " + dto.getMaTaiKhoan()));
            nv.setTaikhoan(tk);
        } else {
            nv.setTaikhoan(null);
        }
    }

    public List<NhanvienResponseDto> getAll() {
        return nhanvienRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public NhanvienResponseDto getById(Integer id) {
        Nhanvien nv = nhanvienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        return toResponseDto(nv);
    }

    public NhanvienResponseDto create(NhanvienRequestDto dto) {
        if (nhanvienRepository.existsBySoDienThoai(dto.getSoDienThoai())) {
            throw new RuntimeException("So dien thoai da ton tai");
        }
        Nhanvien nv = new Nhanvien();
        nv.setTrangThai(TrangThaiNhanVien.DANG_LAM_VIEC.name());
        applyRequestDto(nv, dto);
        return toResponseDto(nhanvienRepository.save(nv));
    }

    public NhanvienResponseDto update(Integer id, NhanvienRequestDto dto) {
        Nhanvien nv = nhanvienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        applyRequestDto(nv, dto);
        return toResponseDto(nhanvienRepository.save(nv));
    }

    public void delete(Integer id) {
        Nhanvien nv = nhanvienRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay nhan vien id: " + id));
        nv.setTrangThai(TrangThaiNhanVien.NGHI_VIEC.name());
        nhanvienRepository.save(nv);

        if (nv.getTaikhoan() != null) {
            taikhoanRepository.delete(nv.getTaikhoan());
        }
    }
}