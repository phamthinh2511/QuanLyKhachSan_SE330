package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.SudungdichvuRequest;
import hotelmanagement.backend.dto.request.KiemkephongRequest;
import hotelmanagement.backend.dto.request.CheckoutRequest;
import hotelmanagement.backend.dto.response.SudungdichvuResponse;
import hotelmanagement.backend.dto.response.KiemkephongResponse;
import hotelmanagement.backend.dto.response.CheckoutResponse;
import hotelmanagement.backend.dto.response.CtHoadonDetailResponse;
import hotelmanagement.backend.entity.*;
import hotelmanagement.backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BillingService {
    
    private final SudungdichvuRepository sudungdichvuRepository;
    private final KiemkephongRepository kiemkephongRepository;
    private final HoadonRepository hoadonRepository;
    private final CtHoadonRepository ctHoadonRepository;
    private final PhieuthuephongRepository phieuthuephongRepository;
    private final DichvuRepository dichvuRepository;
    private final NhanvienRepository nhanvienRepository;
    private final CtPhieuthuephongRepository ctPhieuthuephongRepository;
    private final PhongRepository phongRepository;
    
    /**
     * API 1: Ghi nhận khách gọi thêm dịch vụ phát sinh (đồ ăn, giặt ủi, v.v.)
     */
    @Transactional
    public SudungdichvuResponse addServiceUsage(SudungdichvuRequest request) {
        try {
            // Validate dữ liệu đầu vào
            Phieuthuephong phieuThue = phieuthuephongRepository.findById(request.getMaPhieuThue())
                    .orElseThrow(() -> new RuntimeException("Phiếu thuê phòng không tồn tại"));
            
            Dichvu dichVu = dichvuRepository.findById(request.getMaDichVu())
                    .orElseThrow(() -> new RuntimeException("Dịch vụ không tồn tại"));
            
            Phong phong = phongRepository.findById(request.getMaPhong())
                    .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
            // Tạo bản ghi mới
            Sudungdichvu sudungdichvu = new Sudungdichvu();
            sudungdichvu.setMaPhieuThue(phieuThue);
            sudungdichvu.setMaDichVu(dichVu);
            sudungdichvu.setMaPhong(phong);
            sudungdichvu.setSoLuong(request.getSoLuong());
            sudungdichvu.setDonGia(request.getDonGia());
            sudungdichvu.setThanhTien(request.getSoLuong() * request.getDonGia());
            sudungdichvu.setNgaySuDung(request.getNgaySuDung() != null ? request.getNgaySuDung() : LocalDate.now());
            
            Sudungdichvu saved = sudungdichvuRepository.save(sudungdichvu);
            
            return SudungdichvuResponse.builder()
                    .id(saved.getId())
                    .maPhieuThue(saved.getMaPhieuThue().getId())
                    .maDichVu(saved.getMaDichVu().getId())
                    .tenDichVu(saved.getMaDichVu().getTenDichVu())
                    .maPhong(request.getMaPhong())
                    .soLuong(saved.getSoLuong())
                    .donGia(saved.getDonGia())
                    .thanhTien(saved.getThanhTien())
                    .ngaySuDung(saved.getNgaySuDung().toString())
                    .message("Ghi nhận dịch vụ phát sinh thành công")
                    .build();
        } catch (Exception e) {
            return SudungdichvuResponse.builder()
                    .message("Lỗi: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * API 2: Ghi nhận kiểm kê phòng (hỏng TV, mất chìa khóa, v.v.)
     */
    @Transactional
    public KiemkephongResponse recordRoomInspection(KiemkephongRequest request) {
        try {
            // Validate dữ liệu đầu vào
            Phieuthuephong phieuThue = phieuthuephongRepository.findById(request.getMaPhieuThue())
                    .orElseThrow(() -> new RuntimeException("Phiếu thuê phòng không tồn tại"));
            
            Nhanvien nhanvien = nhanvienRepository.findById(request.getMaNhanVien())
                    .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));
            
            Phong phong = phongRepository.findById(request.getMaPhong())
                    .orElseThrow(() -> new RuntimeException("Phòng không tồn tại"));
            
            // Tạo bản ghi kiểm kê mới
            Kiemkephong kiemke = new Kiemkephong();
            kiemke.setMaPhieuThue(phieuThue);
            kiemke.setMaPhong(phong);
            kiemke.setMaNhanVien(nhanvien);
            kiemke.setNgayKiemKe(request.getNgayKiemKe() != null ? request.getNgayKiemKe() : LocalDate.now());
            kiemke.setTinhTrang(request.getTinhTrang());
            kiemke.setTienBoiThuong(request.getTienBoiThuong() != null ? request.getTienBoiThuong() : 0.0);
            kiemke.setGhiChu(request.getGhiChu());
            
            Kiemkephong saved = kiemkephongRepository.save(kiemke);
            
            return KiemkephongResponse.builder()
                    .id(saved.getId())
                    .maPhieuThue(saved.getMaPhieuThue().getId())
                    .maPhong(request.getMaPhong())
                    .maNhanVien(saved.getMaNhanVien().getId())
                    .ngayKiemKe(saved.getNgayKiemKe().toString())
                    .tinhTrang(saved.getTinhTrang())
                    .tienBoiThuong(saved.getTienBoiThuong())
                    .ghiChu(saved.getGhiChu())
                    .message("Ghi nhận kiểm kê phòng thành công")
                    .build();
        } catch (Exception e) {
            return KiemkephongResponse.builder()
                    .message("Lỗi: " + e.getMessage())
                    .build();
        }
    }
    
    /**
     * API 3: Check-out (Logic cốt lõi)
     * Hàm này sẽ gom tiền từ:
     * - CtPhieuthuephong (tiền phòng)
     * - Sudungdichvu (tiền dịch vụ)
     * - Kiemkephong (tiền phạt)
     * Chốt ra tổng tiền và xuất Hóa đơn cuối cùng
     */
    @Transactional
    public CheckoutResponse checkout(CheckoutRequest request) {
        try {
            Integer maPhieuThue = request.getMaPhieuThue();
            Integer maNhanVien = request.getMaNhanVien();
            
            // Validate dữ liệu đầu vào
            Phieuthuephong phieuThue = phieuthuephongRepository.findById(maPhieuThue)
                    .orElseThrow(() -> new RuntimeException("Phiếu thuê phòng không tồn tại"));
            
            Nhanvien nhanvien = nhanvienRepository.findById(maNhanVien)
                    .orElseThrow(() -> new RuntimeException("Nhân viên không tồn tại"));
            
            // 1. Tính tiền phòng từ CtPhieuthuephong
            Double tienPhong = ctPhieuthuephongRepository.findByPhieuThueId(maPhieuThue)
                    .stream()
                    .mapToDouble(CtPhieuthuephong::getDonGia)
                    .sum();
            
            // 2. Tính tiền dịch vụ từ Sudungdichvu
            Double tienDichVu = sudungdichvuRepository.getTotalServiceCost(maPhieuThue);
            
            // 3. Tính tiền phạt từ Kiemkephong
            Double tienPhat = kiemkephongRepository.getTotalPenaltyCost(maPhieuThue);
            
            // 4. Tính tổng tiền
            Double tongTien = tienPhong + tienDichVu + tienPhat;
            
            // 5. Tạo hóa đơn
            Hoadon hoadon = new Hoadon();
            hoadon.setMaPhieuThue(phieuThue);
            hoadon.setMaNhanVien(nhanvien);
            hoadon.setNgayThanhToan(LocalDate.now());
            hoadon.setTongTien(tongTien);
            
            Hoadon savedHoadon = hoadonRepository.save(hoadon);
            
            // 6. Tạo chi tiết hóa đơn
            List<CtHoadonDetailResponse> chiTietHoaDon = new ArrayList<>();
            
            // Chi tiết tiền phòng từ CtPhieuthuephong
            List<CtPhieuthuephong> danhSachCtPhong = ctPhieuthuephongRepository.findByPhieuThueId(maPhieuThue);
            for (CtPhieuthuephong ctPhieuThue : danhSachCtPhong) {
                CtHoadon ctPhong = new CtHoadon();
                ctPhong.setMaHoaDon(savedHoadon);
                ctPhong.setMaPhong(ctPhieuThue.getMaPhong());
                ctPhong.setLoaiChiPhi("Tiền phòng");
                ctPhong.setSoLuong(1);
                ctPhong.setDonGia(ctPhieuThue.getDonGia());
                ctPhong.setThanhTien(ctPhieuThue.getDonGia());
                
                CtHoadon savedCtPhong = ctHoadonRepository.save(ctPhong);
                
                chiTietHoaDon.add(CtHoadonDetailResponse.builder()
                        .id(savedCtPhong.getId())
                        .maPhong(ctPhieuThue.getMaPhong().getId())
                        .loaiChiPhi("Tiền phòng")
                        .soLuong(1)
                        .donGia(ctPhieuThue.getDonGia())
                        .thanhTien(ctPhieuThue.getDonGia())
                        .build());
            }
            
            // Chi tiết từ dịch vụ phát sinh
            List<Sudungdichvu> danhSachDichVu = sudungdichvuRepository.findByPhieuThueId(maPhieuThue);
            for (Sudungdichvu sv : danhSachDichVu) {
                CtHoadon ctDichVu = new CtHoadon();
                ctDichVu.setMaHoaDon(savedHoadon);
                ctDichVu.setMaPhong(sv.getMaPhong());
                ctDichVu.setMaDichVu(sv.getMaDichVu());
                ctDichVu.setLoaiChiPhi("Dịch vụ");
                ctDichVu.setSoLuong(sv.getSoLuong());
                ctDichVu.setDonGia(sv.getDonGia());
                ctDichVu.setThanhTien(sv.getThanhTien());
                
                CtHoadon savedCtDichVu = ctHoadonRepository.save(ctDichVu);
                
                chiTietHoaDon.add(CtHoadonDetailResponse.builder()
                        .id(savedCtDichVu.getId())
                        .maPhong(sv.getMaPhong().getId())
                        .maDichVu(sv.getMaDichVu().getId())
                        .tenDichVu(sv.getMaDichVu().getTenDichVu())
                        .loaiChiPhi("Dịch vụ")
                        .soLuong(sv.getSoLuong())
                        .donGia(sv.getDonGia())
                        .thanhTien(sv.getThanhTien())
                        .build());
            }
            
            // Chi tiết tiền phạt
            List<Kiemkephong> danhSachKiemKe = kiemkephongRepository.findByPhieuThueId(maPhieuThue);
            for (Kiemkephong kk : danhSachKiemKe) {
                if (kk.getTienBoiThuong() > 0) {
                    CtHoadon ctPhat = new CtHoadon();
                    ctPhat.setMaHoaDon(savedHoadon);
                    ctPhat.setMaPhong(kk.getMaPhong());
                    ctPhat.setLoaiChiPhi("Tiền phạt/Bồi thường");
                    ctPhat.setSoLuong(1);
                    ctPhat.setDonGia(kk.getTienBoiThuong());
                    ctPhat.setThanhTien(kk.getTienBoiThuong());
                    
                    CtHoadon savedCtPhat = ctHoadonRepository.save(ctPhat);
                    
                    chiTietHoaDon.add(CtHoadonDetailResponse.builder()
                            .id(savedCtPhat.getId())
                            .maPhong(kk.getMaPhong().getId())
                            .loaiChiPhi("Tiền phạt/Bồi thường")
                            .soLuong(1)
                            .donGia(kk.getTienBoiThuong())
                            .thanhTien(kk.getTienBoiThuong())
                            .build());
                }
            }
            
            // Trả về response
            return CheckoutResponse.builder()
                    .maHoaDon(savedHoadon.getId())
                    .maPhieuThue(savedHoadon.getMaPhieuThue().getId())
                    .maNhanVien(savedHoadon.getMaNhanVien().getId())
                    .ngayThanhToan(savedHoadon.getNgayThanhToan().toString())
                    .tienPhong(tienPhong)
                    .tienDichVu(tienDichVu)
                    .tienPhat(tienPhat)
                    .tongTien(tongTien)
                    .chiTietHoaDon(chiTietHoaDon)
                    .message("Check-out thành công. Hóa đơn đã được xuất")
                    .build();
        } catch (Exception e) {
            return CheckoutResponse.builder()
                    .message("Lỗi check-out: " + e.getMessage())
                    .build();
        }
    }
}
