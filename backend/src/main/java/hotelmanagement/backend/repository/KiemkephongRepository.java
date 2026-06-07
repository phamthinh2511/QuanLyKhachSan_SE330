package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Kiemkephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KiemkephongRepository extends JpaRepository<Kiemkephong, Integer> {
    
    /**
     * Tìm tất cả kiểm kê phòng theo MaPhieuThue
     */
    @Query("SELECT k FROM Kiemkephong k WHERE k.maPhieuThue.id = ?1")
    List<Kiemkephong> findByPhieuThueId(Integer maPhieuThue);
    
    /**
     * Tính tổng tiền bồi thường cho một phiếu thuê phòng
     */
    @Query("SELECT COALESCE(SUM(k.tienBoiThuong), 0) FROM Kiemkephong k WHERE k.maPhieuThue.id = ?1")
    Double getTotalPenaltyCost(Integer maPhieuThue);

    boolean existsByMaNhanVienId(Integer employeeId);
    boolean existsByMaPhongId(Integer roomId);
}
