package hotelmanagement.backend.repository;
import hotelmanagement.backend.entity.Taikhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.List;

@Repository
public interface TaikhoanRepository extends JpaRepository<Taikhoan, Integer> {
    Optional<Taikhoan> findByTenDangNhap(String tenDangNhap);
    boolean existsByTenDangNhap(String tenDangNhap);

    Optional<Taikhoan> findByTenDangNhapAndIsDeletedFalse(String tenDangNhap);
    boolean existsByTenDangNhapAndIsDeletedFalse(String tenDangNhap);
    List<Taikhoan> findByIsDeletedFalse();
    List<Taikhoan> findByIsDeletedTrue();
    Optional<Taikhoan> findByIdAndIsDeletedFalse(Integer id);
}
