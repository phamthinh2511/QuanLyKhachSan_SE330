package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.LoaiphongDTO;
import hotelmanagement.backend.dto.PhongDTO;
import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.entity.Loaiphong;
import hotelmanagement.backend.repository.PhongRepository;
import hotelmanagement.backend.repository.LoaiphongRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
@Service
@RequiredArgsConstructor
public class PhongService {
    private final LoaiphongRepository loaiphongRepository;
    private final PhongRepository phongRepository;

    // Entity -> DTO
    private LoaiphongDTO toLoaiphongDTO(Loaiphong loaiphong){
        return LoaiphongDTO.builder()
                .id(loaiphong.getId())
                .name(loaiphong.getTenLoaiPhong())
                .description(loaiphong.getMoTa())
                .price(loaiphong.getDonGia())
                .capacity(loaiphong.getSucChuaToiDa())
                .build();
    }
    private PhongDTO toDTO(Phong phong) {
        return PhongDTO.builder()
                .id(phong.getId())
                .floorNumber(phong.getSoTang())
                .capacity(phong.getSucChua())
                .status(phong.getTrangThai())
                .loaiphong(toLoaiphongDTO(phong.getMaLoaiPhong()))
                .build();
    }
    // DTO -> Entity
    private void applyDTO(Phong phong, PhongDTO dto) {
        phong.setTrangThai(dto.getStatus());
        phong.setSoTang(dto.getFloorNumber());
        phong.setSucChua(dto.getCapacity());

        if(dto.getLoaiphong()!=null && dto.getLoaiphong().getId()!=null){
            Loaiphong loaiPhong = loaiphongRepository.findById(dto.getLoaiphong().getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy loại phòng id: " + dto.getLoaiphong().getId()));
            phong.setMaLoaiPhong(loaiPhong);
        }
    }
    public List<PhongDTO> getAll() {
        return phongRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    public PhongDTO getById(Integer id) {
        Phong phong = phongRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        return toDTO(phong);
    }
    public PhongDTO create(PhongDTO dto) {
        Phong phong = new Phong();
        phong.setId(dto.getId()); // MaPhong nhập tay
        applyDTO(phong, dto);
        return toDTO(phongRepository.save(phong));
    }
    public PhongDTO update(Integer id, PhongDTO dto) {
        Phong p = phongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng với id: " + id));
        applyDTO(p, dto);
        return toDTO(phongRepository.save(p));
    }
    public void delete(Integer id) {
        if (!phongRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy phòng với id: " + id);
        }
        phongRepository.deleteById(id);
    }
}
