package hotelmanagement.backend.repository;
import hotelmanagement.backend.entity.Datphong;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuthuephongRepository extends JpaRepository<Phieuthuephong, Integer> {
   List<Phieuthuephong> findByMaDatPhong(Datphong maDatPhong);

}
