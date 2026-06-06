package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Sudungdichvu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SudungdichvuRepository extends JpaRepository<Sudungdichvu, Integer> {
    
    /**
     * Tìm tất cả dịch vụ được sử dụng theo MaPhieuThue
     */
    @Query("SELECT s FROM Sudungdichvu s WHERE s.maPhieuThue.id = ?1")
    List<Sudungdichvu> findByPhieuThueId(Integer maPhieuThue);
    
    /**
     * Tính tổng tiền dịch vụ cho một phiếu thuê phòng
     */
    @Query("SELECT COALESCE(SUM(s.thanhTien), 0) FROM Sudungdichvu s WHERE s.maPhieuThue.id = ?1")
    Double getTotalServiceCost(Integer maPhieuThue);

    boolean existsByMaPhongId(Integer roomId);
    boolean existsByMaDichVuId(Integer serviceId);
}
