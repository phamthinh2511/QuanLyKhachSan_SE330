package hotelmanagement.backend.repository;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuthuephongRepository extends JpaRepository<Phieuthuephong, Integer> {
    List<Phieuthuephong> findByMaDatPhong(Datphong maDatPhong);

    @org.springframework.data.jpa.repository.Query("SELECT p FROM Phieuthuephong p WHERE p.ngayNhanPhong <= :end AND p.ngayTraPhong >= :start")
    List<Phieuthuephong> findActiveInPeriod(@org.springframework.data.repository.query.Param("start") java.time.LocalDate start,
                                            @org.springframework.data.repository.query.Param("end") java.time.LocalDate end);

    @org.springframework.data.jpa.repository.Query("SELECT ct.maPhong.id FROM CtPhieuthuephong ct " +
            "WHERE ct.maPhieuThue.maDatPhong IS NULL " +
            "AND ct.maPhieuThue.trangThai NOT IN ('Đã trả phòng', 'Đã hủy') " +
            "AND ct.maPhieuThue.ngayNhanPhong < :checkOut " +
            "AND ct.maPhieuThue.ngayTraPhong > :checkIn")
    List<Integer> findDirectRentedRoomIds(@org.springframework.data.repository.query.Param("checkIn") java.time.LocalDate checkIn,
                                          @org.springframework.data.repository.query.Param("checkOut") java.time.LocalDate checkOut);

    boolean existsByMaKhachHangId(Integer customerId);
    boolean existsByMaNhanVienId(Integer employeeId);
}