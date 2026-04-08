package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhongRepository extends JpaRepository<Phong,Integer> {
    List<Phong> findAllById(Integer id);
    List<Phong> findAllByTrangThai(String status);
    List<Phong> findAllByMaLoaiPhong(Integer type_id);
    List<Phong> findAllBySoTang(Integer floorNumber);
}
