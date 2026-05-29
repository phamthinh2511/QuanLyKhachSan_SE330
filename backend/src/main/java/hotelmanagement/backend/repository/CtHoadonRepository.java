package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtHoadon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CtHoadonRepository extends JpaRepository<CtHoadon, Integer> {
}
