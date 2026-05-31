package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Hoadon;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HoadonRepository extends JpaRepository<Hoadon, Integer> {
    Optional<Hoadon> findByMaPhieuThue(Phieuthuephong maPhieuThue);
}
