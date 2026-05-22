package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtPhieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CtPhieuthuephongRepository extends JpaRepository<CtPhieuthuephong, Integer> {
    
    /**
     * Tìm tất cả chi tiết tiền thuê phòng theo MaPhieuThue
     */
    @Query("SELECT c FROM CtPhieuthuephong c WHERE c.maPhieuThue.id = ?1")
    List<CtPhieuthuephong> findByPhieuThueId(Integer maPhieuThue);
    
    /**
     * Tính tổng tiền thuê phòng
     */
    @Query("SELECT COALESCE(SUM(c.donGia), 0) FROM CtPhieuthuephong c WHERE c.maPhieuThue.id = ?1")
    Double getTotalRoomCost(Integer maPhieuThue);
}
