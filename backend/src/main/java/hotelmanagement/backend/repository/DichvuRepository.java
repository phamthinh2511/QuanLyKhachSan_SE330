package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Dichvu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DichvuRepository extends JpaRepository<Dichvu, Integer> {
}
