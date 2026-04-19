package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.dto.request.CheckInRequest;
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
    private Phong maPhong;
    // Thuat toan kiem tra phong trong
    public List<Phong> getAvailableRooms(LocalDate checkIn, LocalDate checkOut) {
        List<Integer> bookedRoomIds = datphongRepository.findBookedRoomIds(checkIn, checkOut);
        List<Phong> allRooms = phongRepository.findAll();
        if(bookedRoomIds.isEmpty())
            return allRooms;
        return allRooms.stream()
                .filter(phong -> !bookedRoomIds.contains(phong.getId()))
                .collect(Collectors.toList());
    }

    // API tao don dat phong truoc
    @Transactional
    public Datphong createBooking (BookingRequest request){
        List<Phong> availableRooms = getAvailableRooms(request.getNgayNhan(), request.getNgayTra());
        List<Integer> availableRoomIds = availableRooms.stream().map(Phong::getId).collect(Collectors.toList());
        for(Integer roomId : request.getDsMaPhong()) {
            if(!availableRoomIds.contains(roomId)){
                throw new RuntimeException("Phong " + roomId + " da co nguoi dat trong thoi gian nay!");

            }
        }
        Khachhang kh = khachhangRepository.findById(request.getMaKhachHang())
                .orElseThrow(() -> new RuntimeException("Khach hang khong ton tai!"));
        Datphong dp = new Datphong();
        dp.setMaKhachHang((kh));
        dp.setNgayDat(LocalDate.now());
        dp.setNgayNhan(request.getNgayNhan());
        dp.setNgayTra(request.getNgayTra());
        dp.setTrangThai("CONFIRMED");

        Datphong saveDp = datphongRepository.save(dp);

        for(Integer roomId : request.getDsMaPhong()){
            Phong phong = phongRepository.findById(roomId).get();
            CtDatphong ct = new CtDatphong();
            ct.setMaDatPhong(saveDp);
            ct.setMaPhong(phong);
            ct.setDonGia(phong.getMaLoaiPhong().getDonGia());
            ctDatphongRepository.save(ct);
        }
        return saveDp;

    }

    @Transactional
    public Phieuthuephong checkIn(CheckInRequest request){
        Datphong datphong = datphongRepository.findById(request.getMaDatPhong())
                .orElseThrow(()->new RuntimeException("Khong tim thay don dat phong"));
        Nhanvien nhanvien = nhanvienRepository.findById(request.getMaNhanVien())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên có ID: " + request.getMaNhanVien()));
        Phieuthuephong phieu = new Phieuthuephong();
        phieu.setMaDatPhong(datphong);
        phieu.setMaKhachHang(datphong.getMaKhachHang());
        phieu.setMaNhanVien(nhanvien);
        phieu.setNgayNhanPhong(LocalDate.now());
        phieu.setNgayTraPhong(datphong.getNgayTra());
        phieu.setTrangThai("DANG_THUE");
        Phieuthuephong savedPhieu = phieuthuephongRepository.save(phieu);

        List<CtDatphong> dsPhongDat = ctDatphongRepository.findByMaDatPhong(datphong);
        for (CtDatphong ct : dsPhongDat) {
            Phong phong = ct.getMaPhong();
            phong.setTrangThai("DANG_SU_DUNG");
            phongRepository.save(phong);
            CtPhieuthuephong ctPhieu = new CtPhieuthuephong();
            ctPhieu.setMaPhieuThue(savedPhieu);
            ctPhieu.setMaPhong(phong);
            if (phong.getMaLoaiPhong() != null) {
                ctPhieu.setDonGia(phong.getMaLoaiPhong().getDonGia());
            } else {
                throw new RuntimeException("Phòng " + phong.getId() + " chưa được gán loại phòng hoặc đơn giá!");
            }
            ctPhieuthuephongRepository.save(ctPhieu);
        }
        datphong.setTrangThai("DA_NHAN_PHONG");
        datphongRepository.save(datphong);

        return savedPhieu;


    }



}
