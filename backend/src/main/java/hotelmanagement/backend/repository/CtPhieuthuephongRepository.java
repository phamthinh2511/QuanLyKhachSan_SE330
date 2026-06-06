package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtDatphong;
import hotelmanagement.backend.entity.CtPhieuthuephong;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CtPhieuthuephongRepository extends JpaRepository<CtPhieuthuephong, Integer> {
    List<CtPhieuthuephong> findByMaPhieuThue(Phieuthuephong maPhieuThue);
    
    /**
     * Tìm chi tiết phiếu thuê phòng theo MaPhieuThue (ID)
     */
    @Query("SELECT c FROM CtPhieuthuephong c WHERE c.maPhieuThue.id = ?1")
    List<CtPhieuthuephong> findByPhieuThueId(Integer maPhieuThue);

    boolean existsByMaPhongId(Integer roomId);
}
