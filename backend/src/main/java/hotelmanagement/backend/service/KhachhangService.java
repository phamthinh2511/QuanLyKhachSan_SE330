package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.KhachhangRequestDto;
import hotelmanagement.backend.dto.response.KhachhangResponseDto;
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

    private KhachhangResponseDto toResponseDto(Khachhang kh) {
        return KhachhangResponseDto.builder()
                .id(kh.getId())
                .name(kh.getTenKhachHang())
                .phone(kh.getSoDienThoai())
                .gender(kh.getGioiTinh())
                .birthday(kh.getNgaySinh() != null ? kh.getNgaySinh().toString() : null)
                .address(kh.getDiaChi())
                .email(kh.getEmail())
                .idCard(kh.getCccd())
                .type(kh.getLoaiKhachHang())
                .build();
    }

    private void applyRequestDto(Khachhang kh, KhachhangRequestDto dto) {
        kh.setTenKhachHang(dto.getName());
        kh.setSoDienThoai(dto.getPhone());
        kh.setGioiTinh(dto.getGender());
        kh.setNgaySinh(dto.getBirthday() != null ? LocalDate.parse(dto.getBirthday()) : null);
        kh.setDiaChi(dto.getAddress());
        kh.setEmail(dto.getEmail());
        kh.setCccd(dto.getIdCard());
        kh.setLoaiKhachHang(dto.getType());
    }

    public List<KhachhangResponseDto> getAll() {
        return khachhangRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public KhachhangResponseDto getById(Integer id) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        return toResponseDto(kh);
    }

    public KhachhangResponseDto create(KhachhangRequestDto dto) {
        if (khachhangRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email da ton tai trong he thong");
        }
        if (khachhangRepository.existsByCccd(dto.getIdCard())) {
            throw new RuntimeException("CCCD da ton tai trong he thong");
        }

        Khachhang kh = new Khachhang();
        applyRequestDto(kh, dto);
        return toResponseDto(khachhangRepository.save(kh));
    }

    public KhachhangResponseDto update(Integer id, KhachhangRequestDto dto) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        applyRequestDto(kh, dto);
        return toResponseDto(khachhangRepository.save(kh));
    }

    public void delete(Integer id) {
        if (!khachhangRepository.existsById(id)) {
            throw new RuntimeException("Khong tim thay khach hang voi id: " + id);
        }
        khachhangRepository.deleteById(id);
    }
}