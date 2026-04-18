package hotelmanagement.backend.repository;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PhieuthuephongRepository extends JpaRepository<Phieuthuephong, Integer> {
}
