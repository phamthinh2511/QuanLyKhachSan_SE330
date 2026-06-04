package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {
    List<Phong> findByTrangThai(String trangThai);
    long countByTrangThai(String trangThai);
    List<Phong> findBySoTang(Integer soTang);
    List<Phong> findByMaLoaiPhong(Integer maLoaiPhong);

    @Query("SELECT p FROM Phong p JOIN FETCH p.maLoaiPhong")
    List<Phong> findAllWithLoaiPhong();
}
