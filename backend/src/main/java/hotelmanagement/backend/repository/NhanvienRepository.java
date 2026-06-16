package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Nhanvien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NhanvienRepository extends JpaRepository<Nhanvien, Integer> {
    boolean existsBySoDienThoai(String soDienThoai);
    List<Nhanvien> findByTrangThaiNot(String trangThai);

    List<Nhanvien> findByIsDeletedFalse();
    List<Nhanvien> findByIsDeletedTrue();
    java.util.Optional<Nhanvien> findByIdAndIsDeletedFalse(Integer id);
    boolean existsBySoDienThoaiAndIsDeletedFalse(String soDienThoai);
    boolean existsByTaikhoanId(Integer taikhoanId);
    java.util.Optional<Nhanvien> findByTaikhoanTenDangNhapAndIsDeletedFalse(String tenDangNhap);
}
