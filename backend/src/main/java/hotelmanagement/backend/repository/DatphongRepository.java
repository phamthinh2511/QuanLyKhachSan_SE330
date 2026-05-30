package hotelmanagement.backend.repository;


import hotelmanagement.backend.entity.Datphong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DatphongRepository extends JpaRepository<Datphong, Integer> {

    @Query("SELECT ct.maPhong.id FROM CtDatphong ct " +
            "WHERE ct.maDatPhong.trangThai NOT IN ('Đã hủy', 'Đã trả phòng', 'CANCELLED', 'Checked-out') " +
            "AND ct.maDatPhong.ngayNhan < :checkOut " +
            "AND ct.maDatPhong.ngayTra > :checkIn")
    List<Integer> findBookedRoomIds(@Param("checkIn") LocalDate checkIn,
    @Param("checkOut") LocalDate checkOut);

}
