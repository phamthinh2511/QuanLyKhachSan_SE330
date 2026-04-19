package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.DichvuRequestDto;
import hotelmanagement.backend.dto.response.DichvuResponseDto;
import hotelmanagement.backend.entity.Dichvu;
import hotelmanagement.backend.repository.DichvuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DichvuService {
    private final DichvuRepository dichvuRepository;

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
        return dichvuRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public DichvuResponseDto getById(Integer id) {
        Dichvu dichvu = dichvuRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        return toResponseDto(dichvu);
    }

    public DichvuResponseDto create(DichvuRequestDto dto) {
        Dichvu dichvu = new Dichvu();
        applyRequestDtoToEntity(dichvu, dto);

        // Tự động cấp Mã Dịch Vụ lớn nhất + 1, do bảng dichvu chưa có AUTO_INCREMENT
        Integer maxId = dichvuRepository.findAll().stream()
                .mapToInt(Dichvu::getId)
                .max()
                .orElse(0);
        dichvu.setId(maxId + 1);

        return toResponseDto(dichvuRepository.save(dichvu));
    }

    public DichvuResponseDto update(Integer id, DichvuRequestDto dto) {
        Dichvu dichvu = dichvuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ với id: " + id));
        applyRequestDtoToEntity(dichvu, dto);
        return toResponseDto(dichvuRepository.save(dichvu));
    }

    public void delete(Integer id) {
        if (!dichvuRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy dịch vụ với id: " + id);
        }
        dichvuRepository.deleteById(id);
    }
}
