package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Hoadon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoadonRepository extends JpaRepository<Hoadon, Integer> {
    
    /**
     * Tìm hóa đơn theo MaPhieuThue
     */
    @Query("SELECT h FROM Hoadon h WHERE h.maPhieuThue.id = ?1")
    Optional<Hoadon> findByPhieuThueId(Integer maPhieuThue);
    
    /**
     * Tìm tất cả hóa đơn của một nhân viên
     */
    @Query("SELECT h FROM Hoadon h WHERE h.maNhanVien.id = ?1")
    List<Hoadon> findByNhanvienId(Integer maNhanVien);
}
