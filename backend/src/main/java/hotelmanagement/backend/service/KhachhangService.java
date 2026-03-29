package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.KhachhangDTO;
import hotelmanagement.backend.entity.Khachhang;
import hotelmanagement.backend.repository.KhachhangRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KhachhangService {

    private final KhachhangRepository khachhangRepository;

    // ── Chuyển Entity → DTO ──────────────────────────────────────────────
    private KhachhangDTO toDTO(Khachhang kh) {
        return KhachhangDTO.builder()
                .id(kh.getId())
                .name(kh.getTenKhachHang())
                .phone(kh.getSoDienThoai())
                .gender(kh.getGioiTinh())
                .birthday(kh.getNgaySinh() != null ? kh.getNgaySinh().toString() : null)
                .address(kh.getDiaChi())
                .email(kh.getEmail())
                .idCard(kh.getCccd())
                .status(kh.getLoaiKhachHang())
                .build();
    }

    // ── Chuyển DTO → Entity ──────────────────────────────────────────────
    private void applyDTO(Khachhang kh, KhachhangDTO dto) {
        kh.setTenKhachHang(dto.getName());
        kh.setSoDienThoai(dto.getPhone());
        kh.setGioiTinh(dto.getGender());
        kh.setNgaySinh(dto.getBirthday() != null ? LocalDate.parse(dto.getBirthday()) : null);
        kh.setDiaChi(dto.getAddress());
        kh.setEmail(dto.getEmail());
        kh.setCccd(dto.getIdCard());
        kh.setLoaiKhachHang(dto.getStatus());
    }

    // ── CRUD ─────────────────────────────────────────────────────────────

    public List<KhachhangDTO> getAll() {
        return khachhangRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public KhachhangDTO getById(Integer id) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với id: " + id));
        return toDTO(kh);
    }

    public KhachhangDTO create(KhachhangDTO dto) {
        Khachhang kh = new Khachhang();
        applyDTO(kh, dto);
        return toDTO(khachhangRepository.save(kh));
    }

    public KhachhangDTO update(Integer id, KhachhangDTO dto) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với id: " + id));
        applyDTO(kh, dto);
        return toDTO(khachhangRepository.save(kh));
    }

    public void delete(Integer id) {
        if (!khachhangRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy khách hàng với id: " + id);
        }
        khachhangRepository.deleteById(id);
    }
}