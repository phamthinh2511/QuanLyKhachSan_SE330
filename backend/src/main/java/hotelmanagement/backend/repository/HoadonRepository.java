package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Hoadon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HoadonRepository extends JpaRepository<Hoadon, Integer> {
}
