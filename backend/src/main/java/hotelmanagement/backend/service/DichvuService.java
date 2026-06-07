package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.entity.Dichvu;
import hotelmanagement.backend.repository.DichvuRepository;
import hotelmanagement.backend.repository.SudungdichvuRepository;
import hotelmanagement.backend.repository.CtHoadonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichvuService {
    private final DichvuRepository dichvuRepository;
    private final SudungdichvuRepository sudungdichvuRepository;
    private final CtHoadonRepository ctHoadonRepository;

    private DichvuResponseDto toResponseDto(Dichvu dichvu) {
        return DichvuResponseDto.builder()
                .id(dichvu.getId())
                .tenDichVu(dichvu.getTenDichVu())
                .giaDichVu(dichvu.getGiaDichVu())
                .moTa(dichvu.getMoTa())
                .build();
    }

    private void applyRequestDtoToEntity(Dichvu dichvu, DichvuRequestDto dto) {
        dichvu.setTenDichVu(dto.getTenDichVu());
        dichvu.setGiaDichVu(dto.getGiaDichVu());
        dichvu.setMoTa(dto.getMoTa());
    }

    public List<DichvuResponseDto> getAll() {
        return dichvuRepository.findByIsDeletedFalse()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public DichvuResponseDto getById(Integer id) {
        Dichvu dichvu = dichvuRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        return toResponseDto(dichvu);
    }

    public DichvuResponseDto create(DichvuRequestDto dto) {
        Dichvu dichvu = new Dichvu();
        applyRequestDtoToEntity(dichvu, dto);

        // Tự động cấp Mã Dịch Vụ lớn nhất + 1, dùng findAll để lấy toàn bộ cả record đã xóa tránh trùng ID
        Integer maxId = dichvuRepository.findAll().stream()
                .mapToInt(Dichvu::getId)
                .max()
                .orElse(0);
        dichvu.setId(maxId + 1);

        return toResponseDto(dichvuRepository.save(dichvu));
    }

    public DichvuResponseDto update(Integer id, DichvuRequestDto dto) {
        Dichvu dichvu = dichvuRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        applyRequestDtoToEntity(dichvu, dto);
        return toResponseDto(dichvuRepository.save(dichvu));
    }

    public void delete(Integer id) {
        Dichvu dichvu = dichvuRepository.findByIdAndIsDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        dichvu.setIsDeleted(true);
        dichvu.setDeletedAt(java.time.LocalDateTime.now());
        dichvuRepository.save(dichvu);
    }

    public List<DichvuResponseDto> getTrashBin() {
        return dichvuRepository.findByIsDeletedTrue()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public DichvuResponseDto restore(Integer id) {
        Dichvu dichvu = dichvuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        if (!dichvu.getIsDeleted()) {
            throw new RuntimeException("Dịch vụ không nằm trong thùng rác");
        }
        dichvu.setIsDeleted(false);
        dichvu.setDeletedAt(null);
        return toResponseDto(dichvuRepository.save(dichvu));
    }

    public void hardDelete(Integer id) {
        Dichvu dichvu = dichvuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));

        if (sudungdichvuRepository.existsByMaDichVuId(id) || ctHoadonRepository.existsByMaDichVuId(id)) {
            throw new RuntimeException("Không thể xóa vĩnh viễn dịch vụ này vì đã có lịch sử giao dịch liên quan");
        }

        dichvuRepository.delete(dichvu);
    }
}
