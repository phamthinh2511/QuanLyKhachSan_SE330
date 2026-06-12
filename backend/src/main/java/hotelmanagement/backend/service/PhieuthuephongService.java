package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.entity.CtPhieuthuephong;
import hotelmanagement.backend.entity.Phieuthuephong;
import hotelmanagement.backend.repository.CtPhieuthuephongRepository;
import hotelmanagement.backend.repository.PhieuthuephongRepository;
import hotelmanagement.backend.repository.PhongRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.entity.Sudungdichvu;
import hotelmanagement.backend.repository.SudungdichvuRepository;

@Service
@RequiredArgsConstructor
public class PhieuthuephongService {
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final CtPhieuthuephongRepository ctPhieuthuephongRepository;
    private final PhongRepository phongRepository;
    private final SudungdichvuRepository sudungdichvuRepository;

    private PhieuthuephongResponseDto toResponseDto(Phieuthuephong pt) {
        String bookingCode = pt.getMaDatPhong() != null ? String.valueOf(pt.getMaDatPhong().getId()) : "";
        Integer customerId = pt.getMaKhachHang() != null ? pt.getMaKhachHang().getId() : null;
        String customerName = pt.getMaKhachHang() != null ? pt.getMaKhachHang().getTenKhachHang() : "Khách vãng lai";
        Integer employeeId = pt.getMaNhanVien() != null ? pt.getMaNhanVien().getId() : null;
        String employeeName = pt.getMaNhanVien() != null ? pt.getMaNhanVien().getHoTen() : "Lễ tân";

        // Lấy danh sách số phòng và tính đơn giá tổng
        List<CtPhieuthuephong> details = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
        String roomNumber = "Chưa gán";
        Double roomPrice = 0.0;

        if (details != null && !details.isEmpty()) {
            roomNumber = details.stream()
                    .filter(d -> d.getMaPhong() != null)
                    .map(d -> String.valueOf(d.getMaPhong().getId()))
                    .collect(Collectors.joining(", "));
            
            roomPrice = details.stream()
                    .mapToDouble(d -> d.getDonGia() != null ? d.getDonGia() : 0.0)
                    .sum();
        }

        final String finalRoomNumber = roomNumber;
        return PhieuthuephongResponseDto.builder()
                .id(pt.getId())
                .rentalCode("PT-" + String.format("%03d", pt.getId()))
                .bookingCode(bookingCode)
                .customerId(customerId)
                .customerName(customerName)
                .employeeId(employeeId)
                .employeeName(employeeName)
                .roomNumber(roomNumber)
                .checkIn(pt.getNgayNhanPhong())
                .checkOut(pt.getNgayTraPhong())
                .guests(pt.getSoKhach() != null ? pt.getSoKhach() : 1)
                .roomPrice(roomPrice)
                .status(pt.getTrangThai())
                .serviceUsages(sudungdichvuRepository.findAll().stream()
                        .filter(u -> u.getMaPhieuThue() != null && u.getMaPhieuThue().getId().equals(pt.getId()))
                        .map(u -> SudungdichvuResponseDto.builder()
                                .id(u.getId())
                                .usageCode("SU-" + String.format("%03d", u.getId()))
                                .bookingCode(bookingCode)
                                .customerName(customerName)
                                .roomNumber(finalRoomNumber)
                                .serviceName(u.getMaDichVu() != null ? u.getMaDichVu().getTenDichVu() : "")
                                .quantity(u.getSoLuong())
                                .unitPrice(u.getDonGia())
                                .total(u.getThanhTien())
                                .date(u.getNgaySuDung())
                                .status(u.getTrangThai() != null ? u.getTrangThai() : "Đã sử dụng")
                                .build())
                        .collect(Collectors.toList()))
                .build();
    }

    public List<PhieuthuephongResponseDto> getAll() {
        return phieuthuephongRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    public PhieuthuephongResponseDto getById(Integer id) {
        Phieuthuephong pt = phieuthuephongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu thuê phòng với ID: " + id));
        return toResponseDto(pt);
    }

    @Transactional
    public void delete(Integer id) {
        Phieuthuephong pt = phieuthuephongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu thuê phòng với ID: " + id));
        if ("Đang sử dụng".equalsIgnoreCase(pt.getTrangThai())) {
            throw new IllegalStateException("Không thể xóa phiếu thuê phòng đang ở trạng thái 'Đang sử dụng'!");
        }

        List<Sudungdichvu> sddvList = sudungdichvuRepository.findAll().stream()
                .filter(u -> u.getMaPhieuThue() != null && u.getMaPhieuThue().getId().equals(pt.getId()))
                .collect(Collectors.toList());
        if (!sddvList.isEmpty()) {
            sudungdichvuRepository.deleteAll(sddvList);
        }

        List<CtPhieuthuephong> details = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
        if (details != null && !details.isEmpty()) {
            for (CtPhieuthuephong ct : details) {
                if (ct.getMaPhong() != null) {
                    ct.getMaPhong().setTrangThai("Trống");
                    phongRepository.save(ct.getMaPhong());
                }
            }
            ctPhieuthuephongRepository.deleteAll(details);
        }
        phieuthuephongRepository.delete(pt);
    }

}
