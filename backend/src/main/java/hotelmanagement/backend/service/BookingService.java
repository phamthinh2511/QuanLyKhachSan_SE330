package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.DatPhongResponse;
import hotelmanagement.backend.dto.response.PhieuthuephongResponseDto;
import hotelmanagement.backend.entity.*;
import hotelmanagement.backend.repository.*;
import jakarta.transaction.Transactional;
import org.apache.catalina.LifecycleState;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    private DatphongRepository datphongRepository;
    @Autowired
    private PhongRepository phongRepository;
    @Autowired
    private CtDatphongRepository ctDatphongRepository;
    @Autowired
    private NhanvienRepository nhanvienRepository;
    @Autowired
    private KhachhangRepository khachhangRepository;
    @Autowired
    private PhieuthuephongRepository phieuthuephongRepository;
    @Autowired
    private CtPhieuthuephongRepository ctPhieuthuephongRepository;
    @Autowired
    private HoadonRepository hoadonRepository;
    @Autowired
    private CtHoadonRepository ctHoadonRepository;
    @Autowired
    private SudungdichvuRepository sudungdichvuRepository;

@Transactional
public void xuLyDatHoacThuePhong(BookingRequest request) {
    Khachhang khach = khachhangRepository.findById(request.getMaKhachHangId())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy khách hàng!"));
    Phong phong = phongRepository.findById(request.getMaPhongId())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy phòng!"));

    if ("Bảo trì".equals(phong.getTrangThai())) {
        throw new IllegalStateException("Phòng đang bảo trì, không thể thao tác!");
    }

    String trangThaiYeuCau = request.getTrangThai().trim();
    if ("Chưa nhận".equals(trangThaiYeuCau)) {
        Datphong dp = new Datphong();
        dp.setMaKhachHang(khach);
        dp.setNgayDat(LocalDate.now());
        dp.setNgayNhan(request.getNgayNhan());
        dp.setNgayTra(request.getNgayTra());
        dp.setSoKhach(request.getSoKhach());
        dp.setTrangThai("Chưa nhận");
        Datphong savedDp = datphongRepository.save(dp);

        CtDatphong ctDp = new CtDatphong();
        ctDp.setMaDatPhong(savedDp);
        ctDp.setMaPhong(phong);
        ctDp.setDonGia(request.getDonGia());
        ctDatphongRepository.save(ctDp);
        phong.setTrangThai("Đã đặt");
        phongRepository.save(phong);
    }

    else if ("Đang sử dụng".equals(trangThaiYeuCau)) {
        Nhanvien nv = nhanvienRepository.findById(request.getMaNhanVienId())
                .orElseThrow(() -> new IllegalStateException("Yêu cầu nhân viên lễ tân thực hiện lập phiếu thuê!"));
        Phieuthuephong pt = new Phieuthuephong();
        pt.setMaDatPhong(null);
        pt.setMaKhachHang(khach);
        pt.setMaNhanVien(nv);
        pt.setNgayNhanPhong(LocalDate.now());
        pt.setNgayTraPhong(request.getNgayTra());
        pt.setSoKhach(request.getSoKhach());
        pt.setTrangThai("Đang sử dụng");
        Phieuthuephong savedPt = phieuthuephongRepository.save(pt);

        CtPhieuthuephong ctPt = new CtPhieuthuephong();
        ctPt.setMaPhieuThue(savedPt);
        ctPt.setMaPhong(phong);
        ctPt.setDonGia(request.getDonGia());
        ctPhieuthuephongRepository.save(ctPt);

        phong.setTrangThai("Đang sử dụng");
        phongRepository.save(phong);
    } else {
        throw new IllegalArgumentException("Trạng thái khởi tạo không hợp lệ! Chỉ được chọn 'Chưa nhận' hoặc 'Đang sử dụng'.");
    }
}
    @Transactional
    public void capNhatTrangThaiNghiepVu(Integer id, String trangThaiMoi, Integer maNhanVienId) {
        String cleanStatus = trangThaiMoi.trim();

        boolean laDonDatTruoc = datphongRepository.existsById(id);
        boolean laPhieuThuong = phieuthuephongRepository.existsById(id);

        if (laDonDatTruoc && "Đang sử dụng".equals(cleanStatus)) {
            Datphong dp = datphongRepository.findById(id).get();
            if (!"Chưa nhận".equals(dp.getTrangThai())) {
                throw new IllegalStateException("Lỗi nghiệp vụ! Đơn đặt phòng này đã xử lý hoặc đã hủy.");
            }
            Nhanvien nv = nhanvienRepository.findById(maNhanVienId)
                    .orElseThrow(() -> new IllegalStateException("Cần thông tin nhân viên để thực hiện Check-in."));

            dp.setTrangThai("Đã nhận phòng");
            datphongRepository.save(dp);

            Phieuthuephong pt = new Phieuthuephong();
            pt.setMaDatPhong(dp);
            pt.setMaKhachHang(dp.getMaKhachHang());
            pt.setMaNhanVien(nv);
            pt.setNgayNhanPhong(LocalDate.now());
            pt.setNgayTraPhong(dp.getNgayTra());
            pt.setSoKhach(dp.getSoKhach());
            pt.setTrangThai("Đang sử dụng");
            Phieuthuephong savedPt = phieuthuephongRepository.save(pt);

            List<CtDatphong> ctDps = ctDatphongRepository.findByMaDatPhong(dp);
            for (CtDatphong ct : ctDps) {
                Phong p = ct.getMaPhong();
                p.setTrangThai("Đang sử dụng");
                phongRepository.save(p);
                CtPhieuthuephong ctPt = new CtPhieuthuephong();
                ctPt.setMaPhieuThue(savedPt);
                ctPt.setMaPhong(p);
                ctPt.setDonGia(ct.getDonGia());
                ctPhieuthuephongRepository.save(ctPt);
            }
            return;
        }
        if ("Đã trả phòng".equals(cleanStatus)) {
            Phieuthuephong pt = phieuthuephongRepository.findById(id).orElse(null);
            if (pt == null && laDonDatTruoc) {
                Datphong dp = datphongRepository.findById(id).get();
                pt = phieuthuephongRepository.findByMaDatPhong(dp).stream().findFirst().orElse(null);
            }
            if (pt == null || !"Đang sử dụng".equals(pt.getTrangThai())) {
                throw new IllegalStateException("Lỗi nghiệp vụ! Chỉ đơn đang ở trạng thái 'Đang sử dụng' mới có thể Trả phòng.");
            }

            this.checkOut(pt.getId());
            return;
        }

        if ("Đã hủy".equals(cleanStatus)) {
            if (laDonDatTruoc) {
                Datphong dp = datphongRepository.findById(id).get();
                if (!"Chưa nhận".equals(dp.getTrangThai())) {
                    throw new IllegalStateException("Không thể hủy đơn đặt phòng này vì trạng thái hiện tại không cho phép!");
                }
                dp.setTrangThai("Đã hủy");
                datphongRepository.save(dp);

                List<CtDatphong> details = ctDatphongRepository.findByMaDatPhong(dp);
                for (CtDatphong ct : details) {
                    if (ct.getMaPhong() != null) {
                        ct.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(ct.getMaPhong());
                    }
                }
            } else if (laPhieuThuong) {
                Phieuthuephong pt = phieuthuephongRepository.findById(id).get();
                if (!"Đang sử dụng".equals(pt.getTrangThai())) {
                    throw new IllegalStateException("Không thể hủy phiếu thuê này!");
                }
                pt.setTrangThai("Đã hủy");
                phieuthuephongRepository.save(pt);

                List<CtPhieuthuephong> details = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
                for (CtPhieuthuephong ct : details) {
                    if (ct.getMaPhong() != null) {
                        ct.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(ct.getMaPhong());
                    }
                }
            }
            return;
        }

        throw new IllegalStateException("Hành động chuyển đổi trạng thái không hợp lệ hoặc không được hệ thống hỗ trợ!");
    }
@Transactional
public PhieuthuephongResponseDto checkIn(CheckInRequest request) {
    Datphong datphong = datphongRepository.findById(request.getMaDatPhong())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy đơn đặt phòng hợp lệ!"));
    Nhanvien nhanvien = null;
    if (request.getMaNhanVien() != null) {
        nhanvien = nhanvienRepository.findById(request.getMaNhanVien()).orElse(null);
    }
    if (nhanvien == null) {
        List<Nhanvien> list = nhanvienRepository.findAll();
        if (!list.isEmpty()) {
            nhanvien = list.get(0);
        }
    }
    if (nhanvien == null) {
        nhanvien = new Nhanvien();
        nhanvien.setId(1);
        nhanvien.setHoTen("Lễ tân mặc định");
        nhanvien.setChucVu("Lễ tân");
        nhanvien = nhanvienRepository.save(nhanvien);
    }

    Phieuthuephong phieu = new Phieuthuephong();
    phieu.setMaDatPhong(datphong);
    phieu.setMaKhachHang(datphong.getMaKhachHang());
    phieu.setMaNhanVien(nhanvien);
    phieu.setNgayNhanPhong(LocalDate.now());
    phieu.setNgayTraPhong(datphong.getNgayTra());
    phieu.setSoKhach(datphong.getSoKhach()); // Đảm bảo giữ số lượng khách từ đơn đặt
    phieu.setTrangThai("Đang sử dụng");
    Phieuthuephong savedPhieu = phieuthuephongRepository.save(phieu);
    String soPhongStr = "Chưa gán";
    Double donGiaPhong = 0.0;

    List<CtDatphong> dsPhongDat = ctDatphongRepository.findByMaDatPhong(datphong);
    for (CtDatphong ct : dsPhongDat) {
        Phong phong = ct.getMaPhong();
        if (phong != null) {
            phong.setTrangThai("Đang sử dụng");
            phongRepository.save(phong);
            soPhongStr = String.valueOf(phong.getId());
        }
        CtPhieuthuephong ctPhieu = new CtPhieuthuephong();
        ctPhieu.setMaPhieuThue(savedPhieu);
        ctPhieu.setMaPhong(phong);
        if (ct.getDonGia() != null) {
            ctPhieu.setDonGia(ct.getDonGia());
            donGiaPhong = ct.getDonGia();
        } else if (phong != null && phong.getMaLoaiPhong() != null) {
            ctPhieu.setDonGia(phong.getMaLoaiPhong().getDonGia());
            donGiaPhong = phong.getMaLoaiPhong().getDonGia();
        } else {
            ctPhieu.setDonGia(500000.0); // Giá mặc định nếu hệ thống thiếu dữ liệu cấu hình loại phòng
            donGiaPhong = 500000.0;
        }
        ctPhieuthuephongRepository.save(ctPhieu);
    }

    datphong.setTrangThai("Đã nhận phòng tại quầy");
    datphongRepository.save(datphong);

    return PhieuthuephongResponseDto.builder()
            .id(savedPhieu.getId())
            .rentalCode("PT-" + savedPhieu.getId())
            .bookingCode(String.valueOf(datphong.getId()))
            .customerId(savedPhieu.getMaKhachHang() != null ? savedPhieu.getMaKhachHang().getId() : null)
            .customerName(savedPhieu.getMaKhachHang() != null ? savedPhieu.getMaKhachHang().getTenKhachHang() : "Ẩn danh")
            .employeeId(nhanvien.getId())
            .employeeName(nhanvien.getHoTen())
            .roomNumber(soPhongStr)
            .checkIn(savedPhieu.getNgayNhanPhong())
            .checkOut(savedPhieu.getNgayTraPhong())
            .guests(savedPhieu.getSoKhach() != null ? savedPhieu.getSoKhach() : 1)
            .roomPrice(donGiaPhong)
            .status(savedPhieu.getTrangThai())
            .serviceUsages(new java.util.ArrayList<>()) // Khi mới check-in thì danh sách dịch vụ trống
            .build();
}
public List<DatPhongResponse> getAllBookings() {
    List<Datphong> dsDatPhong = datphongRepository.findAll();
    List<DatPhongResponse> listResponses = dsDatPhong.stream()
            .map(this::convertToDatPhongResponse)
            .collect(Collectors.toList());
    List<Phieuthuephong> dsPhieuThueQuay = phieuthuephongRepository.findAll().stream()
            .filter(pt -> pt.getMaDatPhong() == null)
            .toList();

    for (Phieuthuephong pt : dsPhieuThueQuay) {
        String soPhong = "Chưa gán";
        Double tongTien = 0.0;

        List<CtPhieuthuephong> chiTiet = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
        if (chiTiet != null && !chiTiet.isEmpty()) {
            CtPhieuthuephong ctDauTien = chiTiet.get(0);
            if (ctDauTien.getMaPhong() != null) {
                soPhong = String.valueOf(ctDauTien.getMaPhong().getId());
            }
            tongTien = chiTiet.stream()
                    .mapToDouble(ct -> ct.getDonGia() != null ? ct.getDonGia() : 0.0)
                    .sum();
        }

        int guestsCount = pt.getSoKhach() != null ? pt.getSoKhach() : 1;

        listResponses.add(DatPhongResponse.builder()
                .id(pt.getId())
                .bookingCode(String.valueOf(pt.getId()))
                .customerName(pt.getMaKhachHang() != null ? pt.getMaKhachHang().getTenKhachHang() : "Ẩn danh")
                .roomNumber(soPhong)
                .checkIn(pt.getNgayNhanPhong())
                .checkOut(pt.getNgayTraPhong())
                .guests(guestsCount)
                .amount(tongTien)
                .status(pt.getTrangThai())
                .build());
    }
    return listResponses;
}
    private DatPhongResponse convertToDatPhongResponse(Datphong dp) {
        String soPhong = "Chưa gán";
        Double tongTien = 0.0;
        List<CtDatphong> chiTiet = ctDatphongRepository.findByMaDatPhong(dp);
        if (chiTiet != null && !chiTiet.isEmpty()) {
            CtDatphong ctDauTien = chiTiet.get(0);

            if (ctDauTien.getMaPhong() != null) {
                soPhong = String.valueOf(ctDauTien.getMaPhong().getId());
            }

            tongTien = chiTiet.stream()
                    .mapToDouble(ct -> ct.getDonGia() != null ? ct.getDonGia() : 0.0)
                    .sum();
        }
        int guestsCount = dp.getSoKhach() != null ? dp.getSoKhach() : 1;

        return DatPhongResponse.builder()
                .id(dp.getId())
                .bookingCode(String.valueOf(dp.getId())) // Sử dụng mã ID trong database làm mã booking
                .customerName(dp.getMaKhachHang() != null ? dp.getMaKhachHang().getTenKhachHang() : "Ẩn danh")
                .roomNumber(soPhong)
                .checkIn(dp.getNgayNhan())
                .checkOut(dp.getNgayTra())
                .guests(guestsCount)
                .amount(tongTien)
                .status(dp.getTrangThai())
                .build();
    }

    @Transactional
    public void deleteBooking(Integer id) {
        java.util.Optional<Phieuthuephong> phieuThueOpt = phieuthuephongRepository.findById(id);
        if (phieuThueOpt.isPresent()) {
            Phieuthuephong pt = phieuThueOpt.get();

            if ("Đang sử dụng".equals(pt.getTrangThai())) {
                throw new IllegalStateException("Không thể xóa phiếu thuê phòng vì khách đang ở trong phòng ('Đang sử dụng')!");
            }
            java.util.Optional<Hoadon> hoaDonOpt = hoadonRepository.findByMaPhieuThue(pt);
            if (hoaDonOpt.isPresent()) {
                Hoadon hd = hoaDonOpt.get();
                hd.setMaPhieuThue(null); // Đặt mối liên kết về null để giữ lại hóa đơn lịch sử
                hoadonRepository.save(hd);
                hoadonRepository.flush(); // Ép database cập nhật ngay lập tức để tháo ràng buộc FK
            }

            List<Sudungdichvu> sddvList = sudungdichvuRepository.findByPhieuThueId(pt.getId());
            if (sddvList != null && !sddvList.isEmpty()) {
                sudungdichvuRepository.deleteAll(sddvList);
                sudungdichvuRepository.flush(); // Ép dọn sạch dữ liệu dịch vụ ngay lập tức
            }

            List<CtPhieuthuephong> ctPt = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
            if (ctPt != null && !ctPt.isEmpty()) {
                for (CtPhieuthuephong ct : ctPt) {
                    if (ct.getMaPhong() != null) {
                        ct.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(ct.getMaPhong());
                    }
                }
                ctPhieuthuephongRepository.deleteAll(ctPt);
                ctPhieuthuephongRepository.flush();
            }

            phieuthuephongRepository.delete(pt);
            return; // Kết thúc xử lý phiếu thuê
        }

        java.util.Optional<Datphong> datPhongOpt = datphongRepository.findById(id);
        if (datPhongOpt.isPresent()) {
            Datphong dp = datPhongOpt.get();

            if ("Chưa nhận".equals(dp.getTrangThai()) || "Đã đặt".equals(dp.getTrangThai())) {
                throw new IllegalStateException("Không thể xóa đơn đặt phòng khi đang giữ chỗ! Khách chưa đến nhận phòng.");
            }

            List<Phieuthuephong> phieuThues = phieuthuephongRepository.findByMaDatPhong(dp);
            if (phieuThues != null && !phieuThues.isEmpty()) {
                for (Phieuthuephong pt : phieuThues) {
                    if ("Đang sử dụng".equals(pt.getTrangThai())) {
                        throw new IllegalStateException("Không thể xóa vì đơn này có phòng liên kết đang ở trạng thái 'Đang sử dụng'!");
                    }
                    java.util.Optional<Hoadon> hdAnTheoOpt = hoadonRepository.findByMaPhieuThue(pt);
                    if (hdAnTheoOpt.isPresent()) {
                        Hoadon hd = hdAnTheoOpt.get();
                        hd.setMaPhieuThue(null);
                        hoadonRepository.save(hd);
                        hoadonRepository.flush();
                    }
                    // Dọn dẹp dịch vụ của phiếu thuê liên kết
                    List<Sudungdichvu> sddvList = sudungdichvuRepository.findByPhieuThueId(pt.getId());
                    if (sddvList != null && !sddvList.isEmpty()) {
                        sudungdichvuRepository.deleteAll(sddvList);
                        sudungdichvuRepository.flush();
                    }

                    List<CtPhieuthuephong> ctPts = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
                    if (ctPts != null && !ctPts.isEmpty()) {
                        ctPhieuthuephongRepository.deleteAll(ctPts);
                        ctPhieuthuephongRepository.flush();
                    }
                }
                phieuthuephongRepository.deleteAll(phieuThues);
                phieuthuephongRepository.flush();
            }

            List<CtDatphong> chiTiets = ctDatphongRepository.findByMaDatPhong(dp);
            if (chiTiets != null && !chiTiets.isEmpty()) {
                for (CtDatphong ct : chiTiets) {
                    Phong phong = ct.getMaPhong();
                    if (phong != null) {
                        phong.setTrangThai("Trống");
                        phongRepository.save(phong);
                    }
                    ct.setMaDatPhong(null);
                }
                ctDatphongRepository.deleteAll(chiTiets);
            }
            ctDatphongRepository.flush();
            datphongRepository.delete(dp);
        }
    }

    public List<Phong> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        List<Integer> bookedRoomIds = datphongRepository.findBookedRoomIds(checkIn, checkOut);
        List<Integer> directRentedRoomIds = phieuthuephongRepository.findDirectRentedRoomIds(checkIn, checkOut);
        List<Phong> allRooms = phongRepository.findAll();

        return allRooms.stream()
                .filter(phong -> !bookedRoomIds.contains(phong.getId()) && !directRentedRoomIds.contains(phong.getId()))
                .collect(Collectors.toList());
    }

    @Transactional
    public Datphong updateBooking(Integer id, BookingRequest request) {
        Datphong dp = datphongRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đặt phòng có ID: " + id));

        Khachhang kh = khachhangRepository.findById(request.getMaKhachHangId())
                .orElseThrow(() -> new RuntimeException("Khách hàng không tồn tại!"));

        Integer newRoomId = request.getMaPhongId();
        String cleanStatus = request.getTrangThai() != null ? request.getTrangThai().trim() : "";

        if ("Đang sử dụng".equals(cleanStatus)) {
            dp.setTrangThai("Đã nhận phòng tại quầy");
            datphongRepository.save(dp);

            Integer nvId = request.getMaNhanVienId() != null ? request.getMaNhanVienId() : 1;
            Nhanvien nv = nhanvienRepository.findById(nvId)
                    .orElseThrow(() -> new IllegalStateException("Cần thông tin nhân viên để lập phiếu thuê!"));

            Phieuthuephong pt = new Phieuthuephong();
            pt.setMaDatPhong(dp); // Liên kết với đơn đặt phòng gốc
            pt.setMaKhachHang(kh);
            pt.setMaNhanVien(nv);
            pt.setNgayNhanPhong(LocalDate.now());
            pt.setNgayTraPhong(request.getNgayTra());
            pt.setSoKhach(request.getSoKhach() != null ? request.getSoKhach() : dp.getSoKhach());
            pt.setTrangThai("Đang sử dụng");
            Phieuthuephong savedPt = phieuthuephongRepository.save(pt);

            Phong phong = phongRepository.findById(newRoomId)
                    .orElseThrow(() -> new RuntimeException("Phòng không tồn tại!"));
            phong.setTrangThai("Đang sử dụng");
            phongRepository.save(phong);

            CtPhieuthuephong ctPt = new CtPhieuthuephong();
            ctPt.setMaPhieuThue(savedPt);
            ctPt.setMaPhong(phong);
            ctPt.setDonGia(request.getDonGia() != null ? request.getDonGia() : (phong.getMaLoaiPhong() != null ? phong.getMaLoaiPhong().getDonGia() : 500000.0));
            ctPhieuthuephongRepository.save(ctPt);
            List<CtDatphong> oldDetails = ctDatphongRepository.findByMaDatPhong(dp);
            if (oldDetails != null) {
                for (CtDatphong oldCt : oldDetails) {
                    if (oldCt.getMaPhong() != null && !oldCt.getMaPhong().getId().equals(newRoomId)) {
                        oldCt.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(oldCt.getMaPhong());
                    }
                }
            }

            return dp;
        }

        List<CtDatphong> oldDetails = ctDatphongRepository.findByMaDatPhong(dp);
        if (oldDetails != null) {
            for (CtDatphong oldCt : oldDetails) {
                if (oldCt.getMaPhong() != null && !oldCt.getMaPhong().getId().equals(newRoomId)) {
                    oldCt.getMaPhong().setTrangThai("Trống");
                    phongRepository.save(oldCt.getMaPhong());
                }
            }
            ctDatphongRepository.deleteAll(oldDetails);
            ctDatphongRepository.flush();
        }

        dp.setMaKhachHang(kh);
        dp.setNgayNhan(request.getNgayNhan());
        dp.setNgayTra(request.getNgayTra());
        if (request.getSoKhach() != null) dp.setSoKhach(request.getSoKhach());
        if (request.getTrangThai() != null) dp.setTrangThai(request.getTrangThai());
        Datphong savedDp = datphongRepository.save(dp);

        Phong phong = phongRepository.findById(newRoomId)
                .orElseThrow(() -> new RuntimeException("Phòng không tồn tại!"));

        CtDatphong ct = new CtDatphong();
        ct.setMaDatPhong(savedDp);
        ct.setMaPhong(phong);
        ct.setDonGia(request.getDonGia() != null ? request.getDonGia() : (phong.getMaLoaiPhong() != null ? phong.getMaLoaiPhong().getDonGia() : 500000.0));
        ctDatphongRepository.save(ct);

        if ("Đã hủy".equals(cleanStatus)) {
            phong.setTrangThai("Trống");
        } else {
            phong.setTrangThai("Đã đặt");
        }
        phongRepository.save(phong);

        return savedDp;
    }

    @Transactional
    public void checkOut(Integer bookingId) {
        checkOut(bookingId, "Chưa thanh toán");
    }

    @Transactional
    public void checkOut(Integer bookingId, String paymentMethod) {
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
            throw new IllegalStateException("Không tìm thấy Phiếu Thuê Phòng đang sử dụng hợp lệ!");
        }

        if ("Đã trả phòng".equals(pt.getTrangThai())) {
            throw new IllegalStateException("Đơn này đã thực hiện trả phòng trước đó!");
        }


        long days = java.time.temporal.ChronoUnit.DAYS.between(pt.getNgayNhanPhong(), pt.getNgayTraPhong());
        if (days <= 0) {
            days = 1;
        }

        double roomFee = 0.0;
        List<CtPhieuthuephong> ctPtList = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
        for (CtPhieuthuephong ct : ctPtList) {
            double price = ct.getDonGia() != null ? ct.getDonGia() : 0.0;
            roomFee += price * days;
        }

        final Phieuthuephong finalPt = pt;
        double serviceFee = 0.0;
        List<Sudungdichvu> usages = sudungdichvuRepository.findAll().stream()
                .filter(u -> u.getMaPhieuThue() != null && u.getMaPhieuThue().getId().equals(finalPt.getId()))
                .collect(Collectors.toList());
        for (Sudungdichvu usage : usages) {
            serviceFee += usage.getThanhTien() != null ? usage.getThanhTien() : 0.0;
        }

        double totalAmount = roomFee + serviceFee;

        Hoadon hoadon = new Hoadon();
        hoadon.setMaPhieuThue(pt);

        Nhanvien nhanvien = pt.getMaNhanVien();
        if (nhanvien == null) {
            List<Nhanvien> list = nhanvienRepository.findAll();
            if (!list.isEmpty()) {
                nhanvien = list.get(0);
            }
        }
        if (nhanvien == null) {
            nhanvien = new Nhanvien();
            nhanvien.setId(1);
            nhanvien.setHoTen("Lễ tân mặc định");
            nhanvien.setChucVu("Lễ tân");
            nhanvien = nhanvienRepository.save(nhanvien);
        }
        hoadon.setMaNhanVien(nhanvien);
        hoadon.setTongTien(totalAmount);

        if (paymentMethod == null || paymentMethod.trim().isEmpty() || "Chưa thanh toán".equalsIgnoreCase(paymentMethod)||
                "null".equalsIgnoreCase(paymentMethod.trim())) {
            hoadon.setPhuongThucThanhToan(null);
            hoadon.setTrangThai("Chưa thanh toán");
            hoadon.setNgayThanhToan(null);
        } else {
            hoadon.setPhuongThucThanhToan(paymentMethod);
            hoadon.setTrangThai("Đã thanh toán");
            hoadon.setNgayThanhToan(LocalDate.now());
        }

        Hoadon savedHoadon = hoadonRepository.save(hoadon);

        for (CtPhieuthuephong ct : ctPtList) {
            CtHoadon ctH = new CtHoadon();
            ctH.setMaHoaDon(savedHoadon);
            ctH.setMaPhong(ct.getMaPhong());
            ctH.setLoaiChiPhi("Tiền phòng");
            ctH.setSoLuong((int) days);

            double price = ct.getDonGia() != null ? ct.getDonGia() : 0.0;
            ctH.setDonGia(price);
            ctH.setThanhTien(price * days);
            ctHoadonRepository.save(ctH);
        }

        for (Sudungdichvu usage : usages) {
            CtHoadon ctH = new CtHoadon();
            ctH.setMaHoaDon(savedHoadon);
            ctH.setMaPhong(usage.getMaPhong());
            ctH.setMaDichVu(usage.getMaDichVu());
            ctH.setLoaiChiPhi("Tiền dịch vụ");
            ctH.setSoLuong(usage.getSoLuong());

            double price = usage.getDonGia() != null ? usage.getDonGia() : 0.0;
            double amount = usage.getThanhTien() != null ? usage.getThanhTien() : 0.0;
            ctH.setDonGia(price);
            ctH.setThanhTien(amount);
            ctHoadonRepository.save(ctH);
        }

        pt.setTrangThai("Đã trả phòng");
        phieuthuephongRepository.save(pt);

        for (CtPhieuthuephong ct : ctPtList) {
            if (ct.getMaPhong() != null) {
                ct.getMaPhong().setTrangThai("Trống");
                phongRepository.save(ct.getMaPhong());
            }
        }

    }
}
