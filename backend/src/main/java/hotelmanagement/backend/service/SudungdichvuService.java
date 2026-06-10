package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.SudungdichvuRequestDto;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.entity.*;
import hotelmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SudungdichvuService {
    private final SudungdichvuRepository sudungdichvuRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final DichvuRepository dichvuRepository;
    private final PhongRepository phongRepository;
    private final DatphongRepository datphongRepository;

    private SudungdichvuResponseDto toResponseDto(Sudungdichvu sddv) {
        String bookingCode = sddv.getMaPhieuThue() != null ? String.valueOf(sddv.getMaPhieuThue().getId()) : "";
        
        // Nếu phiếu thuê được tạo từ một đơn đặt trước (maDatPhong != null), dùng ID của đơn đặt trước làm bookingCode
        if (sddv.getMaPhieuThue() != null && sddv.getMaPhieuThue().getMaDatPhong() != null) {
            bookingCode = String.valueOf(sddv.getMaPhieuThue().getMaDatPhong().getId());
        }

        String customerName = "Khách vãng lai";
        if (sddv.getMaPhieuThue() != null && sddv.getMaPhieuThue().getMaKhachHang() != null) {
            customerName = sddv.getMaPhieuThue().getMaKhachHang().getTenKhachHang();
        }

        String roomNumber = sddv.getMaPhong() != null ? String.valueOf(sddv.getMaPhong().getId()) : "";
        String serviceName = sddv.getMaDichVu() != null ? sddv.getMaDichVu().getTenDichVu() : "";

        return SudungdichvuResponseDto.builder()
                .id(sddv.getId())
                .usageCode("SU-" + String.format("%03d", sddv.getId()))
                .bookingCode(bookingCode)
                .customerName(customerName)
                .roomNumber(roomNumber)
                .serviceName(serviceName)
                .quantity(sddv.getSoLuong())
                .unitPrice(sddv.getDonGia())
                .total(sddv.getThanhTien())
                .date(sddv.getNgaySuDung())
                .status(sddv.getTrangThai() != null ? sddv.getTrangThai() : "Đã sử dụng")
                .build();
    }

    public List<SudungdichvuResponseDto> getAll() {
        return sudungdichvuRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public SudungdichvuResponseDto getById(Integer id) {
        Sudungdichvu sddv = sudungdichvuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi sử dụng dịch vụ với ID: " + id));
        return toResponseDto(sddv);
    }

    private Phieuthuephong findPhieuthuephong(String bookingCode) {
        if (bookingCode == null || bookingCode.trim().isEmpty()) {
            throw new RuntimeException("Thiếu thông tin Booking Code!");
        }
        Integer bId = Integer.parseInt(bookingCode.trim());
        
        // 1. Thử tìm theo ID của Phieuthuephong trực tiếp (đối với thuê trực tiếp)
        Phieuthuephong pt = phieuthuephongRepository.findById(bId).orElse(null);
        
        // 2. Nếu không tìm thấy, thử tìm theo Datphong (nếu là booking đặt trước và đã Check-in)
        if (pt == null) {
            Datphong dp = datphongRepository.findById(bId).orElse(null);
            if (dp != null) {
                List<Phieuthuephong> pts = phieuthuephongRepository.findByMaDatPhong(dp);
                if (!pts.isEmpty()) {
                    pt = pts.get(0);
                }
            }
        }
        
        if (pt == null) {
            throw new RuntimeException("Không tìm thấy Phiếu Thuê Phòng hoạt động hợp lệ cho Booking này (hoặc chưa check-in)!");
        }
        return pt;
    }

    private void applyRequestToEntity(Sudungdichvu sddv, SudungdichvuRequestDto dto) {
        Phieuthuephong pt = findPhieuthuephong(dto.getBookingCode());
        
        if (!"Đang sử dụng".equals(pt.getTrangThai())) {
            throw new IllegalStateException("Phiếu thuê phòng không còn hoạt động (Trạng thái: " + pt.getTrangThai() + "), không thể sử dụng thêm dịch vụ!");
        }

        Dichvu dv = dichvuRepository.findAll().stream()
                .filter(d -> d.getTenDichVu().equalsIgnoreCase(dto.getServiceName()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dịch vụ: " + dto.getServiceName()));

        Phong phong = phongRepository.findById(Integer.parseInt(dto.getRoomNumber()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng: " + dto.getRoomNumber()));

        sddv.setMaPhieuThue(pt);
        sddv.setMaDichVu(dv);
        sddv.setMaPhong(phong);
        sddv.setSoLuong(dto.getQuantity());
        sddv.setDonGia(dto.getUnitPrice());
        sddv.setThanhTien(dto.getTotal());
        sddv.setNgaySuDung(dto.getDate());
        sddv.setTrangThai(dto.getStatus() != null ? dto.getStatus() : "Đã sử dụng");
    }

    public SudungdichvuResponseDto create(SudungdichvuRequestDto dto) {
        Sudungdichvu sddv = new Sudungdichvu();
        applyRequestToEntity(sddv, dto);

        Integer maxId = sudungdichvuRepository.findAll().stream()
                .mapToInt(Sudungdichvu::getId)
                .max()
                .orElse(0);
        sddv.setId(maxId + 1);

        return toResponseDto(sudungdichvuRepository.save(sddv));
    }

    public SudungdichvuResponseDto update(Integer id, SudungdichvuRequestDto dto) {
        Sudungdichvu sddv = sudungdichvuRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi sử dụng dịch vụ với ID: " + id));
        applyRequestToEntity(sddv, dto);
        return toResponseDto(sudungdichvuRepository.save(sddv));
    }

    public void delete(Integer id) {
        if (!sudungdichvuRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy bản ghi sử dụng dịch vụ với ID: " + id);
        }
        sudungdichvuRepository.deleteById(id);
    }
}
