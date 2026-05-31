package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtHoadon;
import hotelmanagement.backend.entity.Hoadon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CtHoadonRepository extends JpaRepository<CtHoadon, Integer> {
    List<CtHoadon> findByMaHoaDon(Hoadon maHoaDon);
}
