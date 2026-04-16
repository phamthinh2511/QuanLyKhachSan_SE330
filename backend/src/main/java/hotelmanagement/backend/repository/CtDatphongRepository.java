package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtDatphong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CtDatphongRepository extends JpaRepository<CtDatphong, Integer> {

}
