package hotelmanagement.backend.service;

import hotelmanagement.backend.dto.request.BookingRequest;
import hotelmanagement.backend.entity.CtDatphong;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Khachhang;
import hotelmanagement.backend.entity.Phong;
import hotelmanagement.backend.repository.CtDatphongRepository;
import hotelmanagement.backend.repository.DatphongRepository;
import hotelmanagement.backend.repository.KhachhangRepository;
import hotelmanagement.backend.repository.PhongRepository;
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
    private KhachhangRepository khachhangRepository;

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



}
