package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtHoadon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CtHoadonRepository extends JpaRepository<CtHoadon, Integer> {
    
    /**
     * Tìm tất cả chi tiết hóa đơn theo MaHoaDon
     */
    @Query("SELECT c FROM CtHoadon c WHERE c.maHoaDon.id = ?1")
    List<CtHoadon> findByHoadonId(Integer maHoaDon);
}
