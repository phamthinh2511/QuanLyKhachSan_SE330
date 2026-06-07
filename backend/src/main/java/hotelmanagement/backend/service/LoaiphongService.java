package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.LoaiPhongRequestDto;
import hotelmanagement.backend.dto.response.LoaiPhongResponseDto;
import hotelmanagement.backend.entity.Loaiphong;
import hotelmanagement.backend.repository.LoaiphongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoaiphongService {
    private final LoaiphongRepository loaiphongRepository;
    private final PhongRepository phongRepository;

    private LoaiPhongResponseDto toResponseDto(Loaiphong loaiphong) {
        return LoaiPhongResponseDto.builder()
                .id(loaiphong.getId())
                .tenLoaiPhong(loaiphong.getTenLoaiPhong())
                .donGia(loaiphong.getDonGia())
                .moTa(loaiphong.getMoTa())
                .sucChuaToiDa(loaiphong.getSucChuaToiDa())
                .build();
    }

    private void applyRequestDtoToEntity(Loaiphong loaiphong, LoaiPhongRequestDto dto) {
        loaiphong.setTenLoaiPhong(dto.getTenLoaiPhong());
        loaiphong.setDonGia(dto.getDonGia());
        loaiphong.setMoTa(dto.getMoTa());
        loaiphong.setSucChuaToiDa(dto.getSucChuaToiDa());
    }

    public List<LoaiPhongResponseDto> getAll() {
        return loaiphongRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public LoaiPhongResponseDto getById(Integer id) {
        Loaiphong loaiphong = loaiphongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        return toResponseDto(loaiphong);
    }

    public LoaiPhongResponseDto create(LoaiPhongRequestDto dto) {
        Loaiphong loaiphong = new Loaiphong();
        applyRequestDtoToEntity(loaiphong, dto);
        return toResponseDto(loaiphongRepository.save(loaiphong));
    }

    @Transactional
    public LoaiPhongResponseDto update(Integer id, LoaiPhongRequestDto dto) {
        Loaiphong loaiphong = loaiphongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        
        Integer oldSucChua = loaiphong.getSucChuaToiDa();
        applyRequestDtoToEntity(loaiphong, dto);
        Loaiphong saved = loaiphongRepository.save(loaiphong);

        if (dto.getSucChuaToiDa() != null && !dto.getSucChuaToiDa().equals(oldSucChua)) {
            phongRepository.updateSucChuaByMaLoaiPhongId(dto.getSucChuaToiDa(), id);
        }

        return toResponseDto(saved);
    }

    public void delete(Integer id) {
        Loaiphong loaiphong = loaiphongRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        loaiphong.setIsDeleted(true);
        loaiphong.setDeletedAt(java.time.LocalDateTime.now());
        loaiphongRepository.save(loaiphong);
    }

    public List<LoaiPhongResponseDto> getTrashBin() {
        return loaiphongRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public LoaiPhongResponseDto restore(Integer id) {
        Loaiphong loaiphong = loaiphongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        if (!loaiphong.getIsDeleted()) {
            throw new RuntimeException("Loại phòng không nằm trong thùng rác");
        }
        loaiphong.setIsDeleted(false);
        loaiphong.setDeletedAt(null);
        return toResponseDto(loaiphongRepository.save(loaiphong));
    }

    public void hardDelete(Integer id) {
        Loaiphong loaiphong = loaiphongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));

        if (phongRepository.existsByMaLoaiPhongId(id)) {
            throw new RuntimeException("Không thể xóa vĩnh viễn loại phòng này vì có phòng thuộc loại này tồn tại trong hệ thống");
        }

        loaiphongRepository.delete(loaiphong);
    }
}
