package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.PhongRequestDto;
import hotelmanagement.backend.dto.request.LoaiPhongRequestDto;
import hotelmanagement.backend.dto.response.LoaiPhongResponseDto;
import hotelmanagement.backend.dto.response.PhongResponseDto;
import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.entity.Loaiphong;
import hotelmanagement.backend.repository.PhongRepository;
import hotelmanagement.backend.repository.LoaiphongRepository;
import hotelmanagement.backend.repository.CtDatphongRepository;
import hotelmanagement.backend.repository.CtPhieuthuephongRepository;
import hotelmanagement.backend.repository.CtHoadonRepository;
import hotelmanagement.backend.repository.SudungdichvuRepository;
import hotelmanagement.backend.repository.KiemkephongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PhongService {
    private final LoaiphongRepository loaiphongRepository;
    private final PhongRepository phongRepository;
    private final CtDatphongRepository ctDatphongRepository;
    private final CtPhieuthuephongRepository ctPhieuthuephongRepository;
    private final CtHoadonRepository ctHoadonRepository;
    private final SudungdichvuRepository sudungdichvuRepository;
    private final KiemkephongRepository kiemkephongRepository;

    // Entity -> DTO
    private LoaiPhongResponseDto toLoaiPhongResponseDto(Loaiphong loaiphong){
        return LoaiPhongResponseDto.builder()
                .id(loaiphong.getId())
                .tenLoaiPhong(loaiphong.getTenLoaiPhong())
                .moTa(loaiphong.getMoTa())
                .donGia(loaiphong.getDonGia())
                .sucChuaToiDa(loaiphong.getSucChuaToiDa())
                .build();
    }

    private PhongResponseDto toResponseDto(Phong phong) {
        return PhongResponseDto.builder()
                .id(phong.getId())
                .soTang(phong.getSoTang())
                .sucChua(phong.getSucChua())
                .trangThai(phong.getTrangThai())
                .maLoaiPhong(toLoaiPhongResponseDto(phong.getMaLoaiPhong()))
                .build();
    }

    // DTO -> Entity
    private void applyRequestDtoToEntity(Phong phong, PhongRequestDto dto) {
        phong.setTrangThai(dto.getTrangThai());
        phong.setSoTang(dto.getSoTang());
        phong.setSucChua(dto.getSucChua());

        if (dto.getMaLoaiPhong() != null) {
            Loaiphong loaiPhong = loaiphongRepository.findById(dto.getMaLoaiPhong())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng id: " + dto.getMaLoaiPhong()));
            phong.setMaLoaiPhong(loaiPhong);
        } else if (dto.getLoaiPhong() != null) {
            // Hỗ trợ trường hợp frontend gửi object loaiPhong thay vì maLoaiPhong
            String tenLoaiPhong = dto.getLoaiPhong().getTenLoaiPhong();
            if (tenLoaiPhong != null && !tenLoaiPhong.isEmpty()) {
                Loaiphong loaiPhong = loaiphongRepository.findAll().stream()
                        .filter(l -> tenLoaiPhong.equals(l.getTenLoaiPhong()))
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng theo tên: " + tenLoaiPhong));
                phong.setMaLoaiPhong(loaiPhong);
            } else {
                throw new RuntimeException("Không có đủ thông tin loại phòng (cần tenLoaiPhong hợp lệ trong object loaiPhong).");
            }
        }
    }

    public List<PhongResponseDto> getAll() {
        return phongRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public PhongResponseDto getById(Integer id) {
        Phong phong = phongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        return toResponseDto(phong);
    }

    public PhongResponseDto create(PhongRequestDto dto) {
        Phong phong = new Phong();
        phong.setId(dto.getId()); // MaPhong nhập tay
        applyRequestDtoToEntity(phong, dto);
        return toResponseDto(phongRepository.save(phong));
    }

    public PhongResponseDto update(Integer id, PhongRequestDto dto) {
        Phong p = phongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        applyRequestDtoToEntity(p, dto);
        return toResponseDto(phongRepository.save(p));
    }

    public void delete(Integer id) {
        Phong p = phongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        p.setIsDeleted(true);
        p.setDeletedAt(java.time.LocalDateTime.now());
        phongRepository.save(p);
    }

    public List<PhongResponseDto> getTrashBin() {
        return phongRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public PhongResponseDto restore(Integer id) {
        Phong p = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        if (!p.getIsDeleted()) {
            throw new RuntimeException("Phòng không nằm trong thùng rác");
        }
        p.setIsDeleted(false);
        p.setDeletedAt(null);
        return toResponseDto(phongRepository.save(p));
    }

    public void hardDelete(Integer id) {
        Phong p = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));

        if (ctDatphongRepository.existsByMaPhongId(id) ||
            ctPhieuthuephongRepository.existsByMaPhongId(id) ||
            ctHoadonRepository.existsByMaPhongId(id) ||
            sudungdichvuRepository.existsByMaPhongId(id) ||
            kiemkephongRepository.existsByMaPhongId(id)) {
            throw new RuntimeException("Không thể xóa vĩnh viễn phòng này vì đã có dữ liệu giao dịch liên quan");
        }

        phongRepository.delete(p);
    }
}
