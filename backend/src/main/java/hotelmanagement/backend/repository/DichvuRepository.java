package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Dichvu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DichvuRepository extends JpaRepository<Dichvu, Integer> {
    List<Dichvu> findByTenDichVuContaining(String tenDichVu);
}
