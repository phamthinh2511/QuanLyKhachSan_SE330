package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.KhachhangRequestDto;
import hotelmanagement.backend.dto.response.KhachhangResponseDto;
import hotelmanagement.backend.entity.Khachhang;
import hotelmanagement.backend.repository.KhachhangRepository;
import hotelmanagement.backend.repository.DatphongRepository;
import hotelmanagement.backend.repository.PhieuthuephongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class KhachhangService {

    private final KhachhangRepository khachhangRepository;
    private final DatphongRepository datphongRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;

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
        return khachhangRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public KhachhangResponseDto getById(Integer id) {
        Khachhang kh = khachhangRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        return toResponseDto(kh);
    }

    public KhachhangResponseDto create(KhachhangRequestDto dto) {
        if (khachhangRepository.existsByEmailAndIsDeletedFalse(dto.getEmail())) {
            throw new RuntimeException("Email da ton tai trong he thong");
        }
        if (khachhangRepository.existsByCccdAndIsDeletedFalse(dto.getIdCard())) {
            throw new RuntimeException("CCCD da ton tai trong he thong");
        }
        if (khachhangRepository.existsBySoDienThoaiAndIsDeletedFalse(dto.getPhone())) {
            throw new RuntimeException("So dien thoai da ton tai trong he thong");
        }

        Khachhang kh = new Khachhang();
        applyRequestDto(kh, dto);
        return toResponseDto(khachhangRepository.save(kh));
    }

    public KhachhangResponseDto update(Integer id, KhachhangRequestDto dto) {
        Khachhang kh = khachhangRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        
        if (khachhangRepository.existsByEmailAndIdNotAndIsDeletedFalse(dto.getEmail(), id)) {
            throw new RuntimeException("Email da ton tai trong he thong");
        }
        if (khachhangRepository.existsByCccdAndIdNotAndIsDeletedFalse(dto.getIdCard(), id)) {
            throw new RuntimeException("CCCD da ton tai trong he thong");
        }
        if (khachhangRepository.existsBySoDienThoaiAndIdNotAndIsDeletedFalse(dto.getPhone(), id)) {
            throw new RuntimeException("So dien thoai da ton tai trong he thong");
        }

        applyRequestDto(kh, dto);
        return toResponseDto(khachhangRepository.save(kh));
    }

    public void delete(Integer id) {
        Khachhang kh = khachhangRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        kh.setIsDeleted(true);
        kh.setDeletedAt(java.time.LocalDateTime.now());
        khachhangRepository.save(kh);
    }

    public List<KhachhangResponseDto> getTrashBin() {
        return khachhangRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public KhachhangResponseDto restore(Integer id) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));
        if (!kh.getIsDeleted()) {
            throw new RuntimeException("Khach hang khong nam trong thung rac");
        }
        kh.setIsDeleted(false);
        kh.setDeletedAt(null);
        return toResponseDto(khachhangRepository.save(kh));
    }

    public void hardDelete(Integer id) {
        Khachhang kh = khachhangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Khong tim thay khach hang voi id: " + id));

        if (!kh.getIsDeleted()) {
            throw new RuntimeException("Khach hang khong nam trong thung rac nen khong the xoa vinh vien");
        }

        if (datphongRepository.existsByMaKhachHangId(id) || phieuthuephongRepository.existsByMaKhachHangId(id)) {
            throw new RuntimeException("Khong the xoa vinh vien khach hang nay vi ho da co giao dich trong he thong");
        }

        khachhangRepository.delete(kh);
    }
}