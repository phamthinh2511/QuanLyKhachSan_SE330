package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
import hotelmanagement.backend.dto.response.DatPhongResponse;
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
@Transactional
public void xuLyDatHoacThuePhong(BookingRequest request){
    Khachhang khach = khachhangRepository.findById(request.getMaKhachHangId())
            .orElseThrow(()-> new IllegalStateException("Khong tim thay thong tin khach hang tren he thong!"));
    Phong phong = phongRepository.findById(request.getMaPhongId())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông tin phòng trên hệ thống!"));

    LocalDate ngayHomNay = LocalDate.now();

    // Kiểm tra trạng thái phòng
    if (!"Trống".equals(phong.getTrangThai())) {
        throw new IllegalStateException("Thao tác thất bại! Phòng số " + phong.getId() + " đang ở trạng thái '" + phong.getTrangThai() + "', không sẵn sàng để đặt.");
    }

    // Kiểm tra sức chứa tối đa
    int sucChuaToiDa = 0;
    if (phong.getMaLoaiPhong() != null && phong.getMaLoaiPhong().getSucChuaToiDa() != null) {
        sucChuaToiDa = phong.getMaLoaiPhong().getSucChuaToiDa();
    } else if (phong.getSucChua() != null && phong.getSucChua() != 0) {
        sucChuaToiDa = phong.getSucChua();
    }
    if (sucChuaToiDa > 0 && request.getSoKhach() != null && request.getSoKhach() > sucChuaToiDa) {
        throw new IllegalStateException("Thao tác thất bại! Số lượng khách vượt quá sức chứa tối đa của phòng (" + sucChuaToiDa + " người).");
    }

    // PHÂN NHÁNH XỬ LÝ BIỆT LẬP DỰA VÀO LOẠI HÌNH
    // Nếu chọn thuê trực tiếp tại quầy HOẶC chọn trạng thái là "Đang ở" / "Checked-in"
    if ("THUE_TRUC_TIEP".equals(request.getLoaiHinh()) || "Đã nhận phòng tại quầy".equals(request.getTrangThai())) {
        // ==================== LUỒNG: ĐẶT TẠI QUẦY (THUÊ TRỰC TIẾP) ====================
        if(request.getMaNhanVienId() == null){
            throw new IllegalStateException("Yêu cầu bị từ chối! Thiếu thông tin nhân viên thực hiện lập phiếu thuê");
        }
        Nhanvien nv = nhanvienRepository.findById(request.getMaNhanVienId())
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông tin nhân viên lễ tân hợp lệ!"));

        if (request.getNgayTra().isBefore(ngayHomNay) || request.getNgayTra().isEqual(ngayHomNay)) {
            throw new IllegalStateException("Thao tác thất bại! Ngày trả phòng phải sau ngày nhận phòng (ngày hôm nay).");
        }

        // 1. Lưu thẳng vào Phiếu thuê phòng (Bỏ qua bảng Datphong)
        Phieuthuephong pt = new Phieuthuephong();
        pt.setMaDatPhong(null);
        pt.setMaKhachHang(khach);
        pt.setMaNhanVien(nv);
        pt.setNgayNhanPhong(ngayHomNay); // Lấy luôn ngày hôm nay
        pt.setNgayTraPhong(request.getNgayTra());
        pt.setTrangThai("Đã nhận phòng tại quầy");
        pt.setSoKhach(request.getSoKhach());
        Phieuthuephong savedPt = phieuthuephongRepository.save(pt);

        // 2. Lưu vào Chi tiết phiếu thuê
        CtPhieuthuephong ctPt = new CtPhieuthuephong();
        ctPt.setMaPhieuThue(savedPt);
        ctPt.setMaPhong(phong);
        ctPt.setDonGia(request.getDonGia());
        ctPhieuthuephongRepository.save(ctPt);

        // 3. Đổi trạng thái phòng sang Đang sử dụng
        phong.setTrangThai("Đang sử dụng");
        phongRepository.save(phong);

    } else {
        // ==================== LUỒNG: ĐẶT TRƯỚC (BOOKING) ====================
        // Nới lỏng kiểm tra ngày nhận phòng: cho phép bằng ngày hôm nay (loại bỏ lỗi lệch múi giờ .isBefore)
        if(request.getNgayNhan().isBefore(ngayHomNay.minusDays(1))){
            throw new IllegalStateException("Thao tác thất bại! Ngày nhận phòng đặt trước không được chọn ngày trong quá khứ");
        }
        if (request.getNgayTra().isBefore(request.getNgayNhan()) || request.getNgayTra().isEqual(request.getNgayNhan())) {
            throw new IllegalStateException("Thao tác thất bại! Ngày trả phòng phải sau ngày nhận phòng tối thiểu 1 ngày.");
        }

        // 1. Lưu đơn đặt gốc
        Datphong dp = new Datphong();
        dp.setMaKhachHang(khach);
        dp.setNgayDat(ngayHomNay);
        dp.setNgayNhan(request.getNgayNhan());
        dp.setNgayTra(request.getNgayTra());
        dp.setTrangThai("Chưa nhận");
        dp.setSoKhach(request.getSoKhach());
        Datphong savedDp = datphongRepository.save(dp);

        // 2. Lưu chi tiết phòng đặt
        CtDatphong ctDp = new CtDatphong();
        ctDp.setMaDatPhong(savedDp);
        ctDp.setMaPhong(phong);
        ctDp.setDonGia(request.getDonGia());
        ctDatphongRepository.save(ctDp);

        // 3. Đổi trạng thái phòng sang Đã đặt
        phong.setTrangThai("Đã đặt");
        phongRepository.save(phong);
    }
}
    @Transactional
    public Phieuthuephong checkIn(CheckInRequest request){
        Datphong datphong = datphongRepository.findById(request.getMaDatPhong())
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy đơn đặt phòng hợp lệ!"));

        Nhanvien nhanvien = nhanvienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy nhân viên lễ tân thực hiện!"));

        Phieuthuephong phieu = new Phieuthuephong();
        phieu.setMaDatPhong(datphong);
        phieu.setMaKhachHang(datphong.getMaKhachHang());
        phieu.setMaNhanVien(nhanvien);
        phieu.setNgayNhanPhong(LocalDate.now());
        phieu.setNgayTraPhong(datphong.getNgayTra());
        phieu.setTrangThai("Đang sử dụng");
        Phieuthuephong savedPhieu = phieuthuephongRepository.save(phieu);

        List<CtDatphong> dsPhongDat = ctDatphongRepository.findByMaDatPhong(datphong);
        for (CtDatphong ct : dsPhongDat) {
            Phong phong = ct.getMaPhong();
            phong.setTrangThai("Đang sử dụng");
            phongRepository.save(phong);

            CtPhieuthuephong ctPhieu = new CtPhieuthuephong();
            ctPhieu.setMaPhieuThue(savedPhieu);
            ctPhieu.setMaPhong(phong);
            if (phong.getMaLoaiPhong() != null) {
                ctPhieu.setDonGia(phong.getMaLoaiPhong().getDonGia());
            } else {
                throw new IllegalStateException("Phòng " + phong.getId() + " chưa được gán loại phòng hoặc đơn giá!");
            }
            ctPhieuthuephongRepository.save(ctPhieu);
        }
        datphong.setTrangThai("Đã nhận phòng tại quầy");
        datphongRepository.save(datphong);

        return savedPhieu;
    }
public List<DatPhongResponse> getAllBookings() {
    // 1. Lấy tất cả đơn đặt trước (Mã bắt đầu bằng BK-)
    List<Datphong> dsDatPhong = datphongRepository.findAll();
    List<DatPhongResponse> listResponses = dsDatPhong.stream()
            .map(this::convertToDatPhongResponse)
            .collect(Collectors.toList());

    // 2. Lấy tất cả phiếu thuê trực tiếp tại quầy (Không thông qua đặt trước)
    // Lọc những phiếu thuê có maDatPhong == null để tránh trùng lặp dữ liệu với luồng Check-in
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
                .bookingCode("PT-" + pt.getId()) // Gán tiền tố PT để phân biệt Phiếu Thuê tại quầy
                .customerName(pt.getMaKhachHang() != null ? pt.getMaKhachHang().getTenKhachHang() : "Ẩn danh")
                .roomNumber(soPhong)
                .checkIn(pt.getNgayNhanPhong())
                .checkOut(pt.getNgayTraPhong())
                .guests(guestsCount)
                .amount(tongTien)
                .status(pt.getTrangThai()) // Trạng thái sẽ hiển thị: "Đang ở"
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
                .bookingCode("BK-" + dp.getId())
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
        // Để tránh lỗi "Ràng buộc dữ liệu", ta cần kiểm tra xem id này thuộc bảng Đặt phòng hay Phiếu thuê trực tiếp
        // (Do Frontend truyền ID gốc xuống, ta sẽ dọn dẹp an toàn cả 2 nhánh)

        // Nhánh 1: Thử tìm và dọn dẹp dữ liệu bảng Phiếu thuê phòng trực tiếp trước
        phieuthuephongRepository.findById(id).ifPresent(pt -> {
            List<CtPhieuthuephong> ctPt = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
            if (ctPt != null && !ctPt.isEmpty()) {
                for (CtPhieuthuephong ct : ctPt) {
                    if (ct.getMaPhong() != null) {
                        ct.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(ct.getMaPhong());
                    }
                }
                ctPhieuthuephongRepository.deleteAll(ctPt);
            }
            phieuthuephongRepository.delete(pt);
        });

        // Nhánh 2: Xử lý xóa Đơn đặt phòng gốc (Booking cũ)
        datphongRepository.findById(id).ifPresent(dp -> {
            // Xóa phiếu thuê ăn theo đơn đặt phòng này nếu có (Tránh lỗi khóa ngoại của luồng check-in)
            List<Phieuthuephong> phieuThues = phieuthuephongRepository.findByMaDatPhong(dp);
            if (phieuThues != null && !phieuThues.isEmpty()) {
                for (Phieuthuephong pt : phieuThues) {
                    List<CtPhieuthuephong> ctPts = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
                    if (ctPts != null && !ctPts.isEmpty()) {
                        ctPhieuthuephongRepository.deleteAll(ctPts);
                    }
                }
                phieuthuephongRepository.deleteAll(phieuThues);
            }

            // Giải phóng phòng từ Đơn đặt trước về Trống
            List<CtDatphong> chiTiets = ctDatphongRepository.findByMaDatPhong(dp);
            if (chiTiets != null && !chiTiets.isEmpty()) {
                for (CtDatphong ct : chiTiets) {
                    Phong phong = ct.getMaPhong();
                    if (phong != null && ("Đã đặt".equals(phong.getTrangThai()) || "Đang sử dụng".equals(phong.getTrangThai()))) {
                        phong.setTrangThai("Trống");
                        phongRepository.save(phong);
                    }
                }
                ctDatphongRepository.deleteAll(chiTiets);
            }
            datphongRepository.delete(dp);
        });
    }


@Transactional
public void updateBooking(Integer id, BookingRequest request) {
    // ĐẢM BẢO SỬA ĐÚNG TRÊN ĐƠN GỐC - KHÔNG SINH ĐƠN MỚI
    String loaiHinh = request.getLoaiHinh();
    Khachhang khach = khachhangRepository.findById(request.getMaKhachHangId())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông tin khách hàng!"));
    Phong phongMoi = phongRepository.findById(request.getMaPhongId())
            .orElseThrow(() -> new IllegalStateException("Không tìm thấy thông tin phòng mới!"));

    // === PHÂN TÁCH LUỒNG UPDATE ĐỂ SỬA NGAY TRÊN BẢNG TƯƠNG ỨNG ===

    if ("THUE_TRUC_TIEP".equals(loaiHinh) || "Đang nhận phòng tại quầy".equals(request.getTrangThai())) {
        // ------------------ LUỒNG CHỈNH SỬA CHO PHIẾU THUÊ TẠI QUẦY ------------------
        Phieuthuephong pt = phieuthuephongRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy phiếu thuê tại quầy cần sửa có ID: " + id));

        // 1. Hoàn tác giải phóng phòng cũ của phiếu thuê về trống
        List<CtPhieuthuephong> ctCuList = ctPhieuthuephongRepository.findByMaPhieuThue(pt);
        if (ctCuList != null && !ctCuList.isEmpty()) {
            for (CtPhieuthuephong ct : ctCuList) {
                if (ct.getMaPhong() != null) {
                    ct.getMaPhong().setTrangThai("Trống");
                    phongRepository.save(ct.getMaPhong());
                }
            }
            ctPhieuthuephongRepository.deleteAll(ctCuList);
        }

        // 2. Cập nhật thuộc tính của chính Phiếu thuê đó
        pt.setMaKhachHang(khach);
        pt.setNgayTraPhong(request.getNgayTra());
        if (request.getSoKhach() != null) {
            pt.setSoKhach(request.getSoKhach());
        }
        if (request.getTrangThai() != null) {
            pt.setTrangThai(request.getTrangThai());
        }
        phieuthuephongRepository.save(pt);

        // Xử lý nếu chuyển trạng thái kết thúc phòng
        if ("Đã trả phòng".equals(request.getTrangThai()) || "Đã hủy".equals(request.getTrangThai())) {
            phongMoi.setTrangThai("Trống");
            phongRepository.save(phongMoi);
            return;
        }

        // 3. Ghép phòng mới vào chi tiết phiếu thuê
        CtPhieuthuephong ctMoi = new CtPhieuthuephong();
        ctMoi.setMaPhieuThue(pt);
        ctMoi.setMaPhong(phongMoi);
        ctMoi.setDonGia(request.getDonGia());
        ctPhieuthuephongRepository.save(ctMoi);

        phongMoi.setTrangThai("Đang sử dụng");
        phongRepository.save(phongMoi);

    } else {
        // ------------------ LUỒNG CHỈNH SỬA CHO ĐƠN ĐẶT TRƯỚC ------------------
        Datphong dp = datphongRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Không tìm thấy phiếu đặt phòng cần sửa có ID: " + id));

        String trangThaiMoi = request.getTrangThai();

        // 1. Xử lý đóng phòng nếu hủy hoặc trả phòng sớm
        if ("Đã trả phòng".equals(trangThaiMoi) || "Đã hủy".equals(trangThaiMoi)) {
            List<CtDatphong> chiTiets = ctDatphongRepository.findByMaDatPhong(dp);
            if (chiTiets != null && !chiTiets.isEmpty()) {
                for (CtDatphong ct : chiTiets) {
                    if ("Đã hủy".equals(trangThaiMoi)) {
                        ct.setDonGia(0.0);
                        ctDatphongRepository.save(ct);
                    }
                    if (ct.getMaPhong() != null) {
                        ct.getMaPhong().setTrangThai("Trống");
                        phongRepository.save(ct.getMaPhong());
                    }
                }
            }
            dp.setTrangThai(trangThaiMoi);
            if (request.getSoKhach() != null) {
                dp.setSoKhach(request.getSoKhach());
            }
            datphongRepository.save(dp);
            return;
        }

        // 2. Thu hồi phòng cũ của Đơn đặt trước
        List<CtDatphong> chiTietsCu = ctDatphongRepository.findByMaDatPhong(dp);
        if (chiTietsCu != null && !chiTietsCu.isEmpty()) {
            for (CtDatphong ct : chiTietsCu) {
                if (ct.getMaPhong() != null) {
                    ct.getMaPhong().setTrangThai("Trống");
                    phongRepository.save(ct.getMaPhong());
                }
            }
            ctDatphongRepository.deleteAll(chiTietsCu);
        }

        // 3. Lưu đè trực tiếp lên chính bản ghi Đặt phòng cũ
        dp.setMaKhachHang(khach);
        dp.setNgayNhan(request.getNgayNhan());
        dp.setNgayTra(request.getNgayTra());
//        if (trangThaiMoi != null) {
//            dp.setTrangThai(trangThaiMoi);
//        }
//        if (request.getSoKhach() != null) {
//            dp.setSoKhach(request.getSoKhach());
//        }
//        datphongRepository.save(dp);
//
//        // 4. Tạo chi tiết đặt phòng mới
//        CtDatphong ctMoi = new CtDatphong();
//        ctMoi.setMaDatPhong(dp);
//        ctMoi.setMaPhong(phongMoi);
//        ctMoi.setDonGia(request.getDonGia());
//        ctDatphongRepository.save(ctMoi);
//
//        // Cập nhật trạng thái chuẩn cho phòng
//        if ("Đã nhận phòng".equals(trangThaiMoi)) {
//            phongMoi.setTrangThai("Đang sử dụng");
//        } else {
//            phongMoi.setTrangThai("Đã đặt");
//        }
//        phongRepository.save(phongMoi);
//        dp.setMaKhachHang(khach);
//        dp.setNgayNhan(ngayNhanMoi);
//        dp.setNgayTra(ngayTraMoi);
        if (request.getSoKhach() != null) dp.setSoKhach(request.getSoKhach());

        // CHUYỂN ĐỔI THÔNG MINH: Nếu chọn "Nhận phòng đặt trước", lưu xuống DB là "Đã nhận phòng"
        if ("Nhận phòng đặt trước".equals(trangThaiMoi) || "Đã nhận phòng đặt trước".equals(trangThaiMoi)) {
            dp.setTrangThai("Đã nhận phòng đặt trước");
            phongMoi.setTrangThai("Đang sử dụng"); // Ép phòng sang bận luôn
        } else {
            dp.setTrangThai(trangThaiMoi != null ? trangThaiMoi : "Chưa nhận");
            phongMoi.setTrangThai("Đã đặt");
        }
        datphongRepository.save(dp);

        // Tạo chi tiết đặt phòng mới gán phòng bận
        CtDatphong ctMoi = new CtDatphong();
        ctMoi.setMaDatPhong(dp);
        ctMoi.setMaPhong(phongMoi);
        ctMoi.setDonGia(request.getDonGia());
        ctDatphongRepository.save(ctMoi);

        phongRepository.save(phongMoi);
    }
}


}
