package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Sudungdichvu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SudungdichvuRepository extends JpaRepository<Sudungdichvu, Integer> {
}
