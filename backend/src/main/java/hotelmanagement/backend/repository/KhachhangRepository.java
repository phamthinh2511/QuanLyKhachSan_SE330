package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Khachhang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KhachhangRepository extends JpaRepository<Khachhang, Integer> {
    List<Khachhang> findByTenKhachHang(String tenKhachHang);
    boolean existsByEmail(String email);
    boolean existsByCccd(String cccd);

    List<Khachhang> findByIsDeletedFalse();
    List<Khachhang> findByIsDeletedTrue();
    java.util.Optional<Khachhang> findByIdAndIsDeletedFalse(Integer id);
    boolean existsByEmailAndIsDeletedFalse(String email);
    boolean existsByCccdAndIsDeletedFalse(String cccd);
}