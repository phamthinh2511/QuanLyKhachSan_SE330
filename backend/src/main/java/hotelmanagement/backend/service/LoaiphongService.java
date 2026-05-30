package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.LoaiPhongRequestDto;
import hotelmanagement.backend.dto.response.LoaiPhongResponseDto;
import hotelmanagement.backend.entity.Loaiphong;
import hotelmanagement.backend.repository.LoaiphongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoaiphongService {
    private final LoaiphongRepository loaiphongRepository;

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
        return loaiphongRepository.findAll()
                .stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public LoaiPhongResponseDto getById(Integer id) {
        Loaiphong loaiphong = loaiphongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        return toResponseDto(loaiphong);
    }

    public LoaiPhongResponseDto create(LoaiPhongRequestDto dto) {
        Loaiphong loaiphong = new Loaiphong();
        applyRequestDtoToEntity(loaiphong, dto);
        return toResponseDto(loaiphongRepository.save(loaiphong));
    }

    public LoaiPhongResponseDto update(Integer id, LoaiPhongRequestDto dto) {
        Loaiphong loaiphong = loaiphongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng với id: " + id));
        applyRequestDtoToEntity(loaiphong, dto);
        return toResponseDto(loaiphongRepository.save(loaiphong));
    }

    public void delete(Integer id) {
        if (!loaiphongRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy loại phòng với id: " + id);
        }
        loaiphongRepository.deleteById(id);
    }
}
