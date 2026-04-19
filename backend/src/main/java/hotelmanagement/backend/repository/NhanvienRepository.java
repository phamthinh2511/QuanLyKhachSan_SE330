package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Nhanvien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NhanvienRepository extends JpaRepository<Nhanvien, Integer> {
    boolean existsBySoDienThoai(String soDienThoai);
}
