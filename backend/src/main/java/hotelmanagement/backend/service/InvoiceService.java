package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.InvoiceRequestDto;
import hotelmanagement.backend.dto.response.InvoiceResponseDto;
import hotelmanagement.backend.dto.response.SudungdichvuResponseDto;
import hotelmanagement.backend.entity.*;
import hotelmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import hotelmanagement.backend.dto.response.InvoicePageResponseDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final HoadonRepository hoadonRepository;
    private final CtHoadonRepository ctHoadonRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final DatphongRepository datphongRepository;
    private final BookingService bookingService;

    private InvoiceResponseDto toDto(Hoadon hoadon) {
        String bookingCode = "";
        String customerName = "Khách vãng lai";
        String roomNumber = "";

        if (hoadon.getMaPhieuThue() != null) {
            bookingCode = String.valueOf(hoadon.getMaPhieuThue().getId());
            if (hoadon.getMaPhieuThue().getMaDatPhong() != null) {
                bookingCode = String.valueOf(hoadon.getMaPhieuThue().getMaDatPhong().getId());
            }
            if (hoadon.getMaPhieuThue().getMaKhachHang() != null) {
                customerName = hoadon.getMaPhieuThue().getMaKhachHang().getTenKhachHang();
            }
        }

        List<CtHoadon> details = ctHoadonRepository.findByMaHoaDon(hoadon);
        double roomCost = 0.0;
        double serviceCost = 0.0;

        List<SudungdichvuResponseDto> serviceUsages = new ArrayList<>();

        for (CtHoadon ct : details) {
            if ("Tiền phòng".equalsIgnoreCase(ct.getLoaiChiPhi())) {
                roomCost += ct.getThanhTien();
                if (ct.getMaPhong() != null) {
                    roomNumber = String.valueOf(ct.getMaPhong().getId());
                }
            } else if ("Tiền dịch vụ".equalsIgnoreCase(ct.getLoaiChiPhi())) {
                serviceCost += ct.getThanhTien();

                String ctRoomNum = ct.getMaPhong() != null ? String.valueOf(ct.getMaPhong().getId()) : "";
                String serviceName = ct.getMaDichVu() != null ? ct.getMaDichVu().getTenDichVu() : "Dịch vụ";

                SudungdichvuResponseDto serviceUsage = SudungdichvuResponseDto.builder()
                        .id(ct.getId())
                        .usageCode("SU-" + String.format("%03d", ct.getId()))
                        .bookingCode(bookingCode)
                        .customerName(customerName)
                        .roomNumber(ctRoomNum)
                        .serviceName(serviceName)
                        .quantity(ct.getSoLuong())
                        .unitPrice(ct.getDonGia())
                        .total(ct.getThanhTien())
                        .date(hoadon.getNgayThanhToan())
                        .status("Đã sử dụng")
                        .build();
                serviceUsages.add(serviceUsage);
            }
        }

        String year = String.valueOf(hoadon.getNgayThanhToan().getYear());
        String code = "INV-" + year + "-" + String.format("%03d", hoadon.getId());

        return InvoiceResponseDto.builder()
                .id(hoadon.getId())
                .invoiceCode(code)
                .bookingCode(bookingCode)
                .customerName(customerName)
                .roomNumber(roomNumber)
                .roomCost(roomCost)
                .serviceCost(serviceCost)
                .total(hoadon.getTongTien())
                .paymentMethod(hoadon.getPhuongThucThanhToan() != null ? hoadon.getPhuongThucThanhToan() : "Tiền mặt")
                .status(hoadon.getTrangThai() != null ? hoadon.getTrangThai() : "Đã thanh toán")
                .createdAt(hoadon.getNgayThanhToan())
                .serviceUsages(serviceUsages)
                .build();
    }

    public List<InvoiceResponseDto> getAll() {
        return hoadonRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public InvoiceResponseDto getById(Integer id) {
        Hoadon hoadon = hoadonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + id));
        return toDto(hoadon);
    }

    @Transactional
    public InvoiceResponseDto create(InvoiceRequestDto dto) {
        if (dto.getBookingCode() == null || dto.getBookingCode().trim().isEmpty()) {
            throw new RuntimeException("Thiếu mã booking!");
        }

        Integer bookingId = Integer.parseInt(dto.getBookingCode().trim());

        // Gọi logic checkout của BookingService để tạo hóa đơn
        bookingService.checkOut(bookingId, dto.getPaymentMethod() != null ? dto.getPaymentMethod() : "Tiền mặt");

        // Tìm phiếu thuê tương ứng sau khi checkout thành công
        Phieuthuephong pt = phieuthuephongRepository.findById(bookingId).orElse(null);
        if (pt == null) {
            Datphong dp = datphongRepository.findById(bookingId).orElse(null);
            if (dp != null) {
                List<Phieuthuephong> pts = phieuthuephongRepository.findByMaDatPhong(dp);
                if (!pts.isEmpty()) {
                    pt = pts.get(0);
                }
            }
        }

        if (pt == null) {
            throw new RuntimeException("Không tìm thấy Phiếu Thuê cho Booking này sau khi check-out!");
        }

        Hoadon hoadon = hoadonRepository.findByMaPhieuThue(pt)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn được tạo cho phiếu thuê sau khi check-out!"));

        return toDto(hoadon);
    }

    @Transactional
    public InvoiceResponseDto update(Integer id, InvoiceResponseDto dto) {
        Hoadon hoadon = hoadonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + id));

        hoadon.setPhuongThucThanhToan(dto.getPaymentMethod());
        hoadon.setTrangThai(dto.getStatus());

        List<CtHoadon> details = ctHoadonRepository.findByMaHoaDon(hoadon);

        // Cập nhật lại đơn giá và thành tiền của Tiền phòng nếu có thay đổi
        if (dto.getRoomCost() != null) {
            for (CtHoadon ct : details) {
                if ("Tiền phòng".equalsIgnoreCase(ct.getLoaiChiPhi())) {
                    ct.setDonGia(dto.getRoomCost() / (ct.getSoLuong() > 0 ? ct.getSoLuong() : 1));
                    ct.setThanhTien(dto.getRoomCost());
                    ctHoadonRepository.save(ct);
                }
            }
        }

        // Cập nhật lại đơn giá và thành tiền của Tiền dịch vụ nếu có thay đổi
        if (dto.getServiceCost() != null) {
            double currentServiceCost = details.stream()
                    .filter(ct -> "Tiền dịch vụ".equalsIgnoreCase(ct.getLoaiChiPhi()))
                    .mapToDouble(CtHoadon::getThanhTien)
                    .sum();

            if (Math.abs(currentServiceCost - dto.getServiceCost()) > 0.01) {
                List<CtHoadon> serviceDetails = details.stream()
                        .filter(ct -> "Tiền dịch vụ".equalsIgnoreCase(ct.getLoaiChiPhi()))
                        .collect(Collectors.toList());
                if (!serviceDetails.isEmpty()) {
                    CtHoadon firstService = serviceDetails.get(0);
                    firstService.setThanhTien(dto.getServiceCost());
                    firstService.setDonGia(dto.getServiceCost() / (firstService.getSoLuong() > 0 ? firstService.getSoLuong() : 1));
                    ctHoadonRepository.save(firstService);
                }
            }
        }

        // Tính lại tổng tiền từ chi tiết hóa đơn
        List<CtHoadon> updatedDetails = ctHoadonRepository.findByMaHoaDon(hoadon);
        double total = updatedDetails.stream().mapToDouble(CtHoadon::getThanhTien).sum();
        hoadon.setTongTien(total);

        Hoadon saved = hoadonRepository.save(hoadon);
        return toDto(saved);
    }

    @Transactional
    public void delete(Integer id) {
        Hoadon hoadon = hoadonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn có ID: " + id));

        List<CtHoadon> details = ctHoadonRepository.findByMaHoaDon(hoadon);
        if (details != null && !details.isEmpty()) {
            ctHoadonRepository.deleteAll(details);
        }

        hoadonRepository.delete(hoadon);
    }

    public InvoicePageResponseDto getPagedInvoices(Integer year, Integer month, String search, String status, int page, int size) {
        LocalDate startDate = null;
        LocalDate endDate = null;

        if (year != null && month != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        }

        String searchVal = search != null ? search.trim() : "";
        String statusVal = status != null ? status.trim() : "";

        Pageable pageable = PageRequest.of(page, size, Sort.by("ngayThanhToan").descending().and(Sort.by("id").descending()));

        Page<Hoadon> hoadonPage;
        long totalCount;
        double paidAmount;
        double pendingAmount;

        if (startDate != null && endDate != null) {
            hoadonPage = hoadonRepository.searchInvoicesWithDate(startDate, endDate, searchVal, statusVal, pageable);
            totalCount = hoadonRepository.countInvoicesWithDate(startDate, endDate);
            double totalAmount = hoadonRepository.sumTotalAmountWithDate(startDate, endDate);
            paidAmount = hoadonRepository.sumAmountByStatusWithDate(startDate, endDate, "Đã thanh toán");
            pendingAmount = totalAmount - paidAmount;
        } else {
            hoadonPage = hoadonRepository.searchInvoicesAllTime(searchVal, statusVal, pageable);
            totalCount = hoadonRepository.countInvoicesAllTime();
            double totalAmount = hoadonRepository.sumTotalAmountAllTime();
            paidAmount = hoadonRepository.sumAmountByStatusAllTime("Đã thanh toán");
            pendingAmount = totalAmount - paidAmount;
        }

        List<InvoiceResponseDto> content = hoadonPage.getContent().stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        return InvoicePageResponseDto.builder()
                .content(content)
                .pageNumber(hoadonPage.getNumber())
                .pageSize(hoadonPage.getSize())
                .totalElements(hoadonPage.getTotalElements())
                .totalPages(hoadonPage.getTotalPages())
                .last(hoadonPage.isLast())
                .totalCount(totalCount)
                .paidAmount(paidAmount)
                .pendingAmount(pendingAmount)
                .build();
    }

    public List<InvoiceResponseDto> getFilteredInvoices(Integer year, Integer month) {
        LocalDate startDate = null;
        LocalDate endDate = null;

        if (year != null && month != null) {
            startDate = LocalDate.of(year, month, 1);
            endDate = startDate.withDayOfMonth(startDate.lengthOfMonth());
        }

        List<Hoadon> list;
        if (startDate != null && endDate != null) {
            list = hoadonRepository.findByNgayThanhToanBetween(startDate, endDate);
        } else {
            list = hoadonRepository.findAll();
        }

        return list.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<InvoiceResponseDto> getInvoicesInPeriod(LocalDate start, LocalDate end) {
        return hoadonRepository.findByNgayThanhToanBetween(start, end).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }
}
