package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Sudungdichvu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SudungdichvuRepository extends JpaRepository<Sudungdichvu, Integer> {
    
    /**
     * Tìm tất cả dịch vụ theo MaPhieuThue (bao gồm mọi trạng thái)
     */
    @Query("SELECT s FROM Sudungdichvu s WHERE s.maPhieuThue.id = ?1")
    List<Sudungdichvu> findByPhieuThueId(Integer maPhieuThue);

    /**
     * Tìm dịch vụ hợp lệ để tính vào hóa đơn (Đã sử dụng + Chờ sử dụng, bỏ Đã hủy)
     */
    @Query("SELECT s FROM Sudungdichvu s WHERE s.maPhieuThue.id = ?1 AND (s.trangThai = 'Đã sử dụng' OR s.trangThai = 'Chờ sử dụng' OR s.trangThai IS NULL)")
    List<Sudungdichvu> findBillableByPhieuThueId(Integer maPhieuThue);

    /**
     * Tính tổng tiền dịch vụ hợp lệ (Đã sử dụng + Chờ sử dụng, bỏ Đã hủy)
     */
    @Query("SELECT COALESCE(SUM(s.thanhTien), 0) FROM Sudungdichvu s WHERE s.maPhieuThue.id = ?1 AND (s.trangThai = 'Đã sử dụng' OR s.trangThai = 'Chờ sử dụng' OR s.trangThai IS NULL)")
    Double getTotalServiceCost(Integer maPhieuThue);
}
