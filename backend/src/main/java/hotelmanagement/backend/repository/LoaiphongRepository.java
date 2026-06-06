package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Loaiphong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoaiphongRepository extends JpaRepository<Loaiphong,Integer> {
    List<Loaiphong> findById(Loaiphong loaiPhong);

    List<Loaiphong> findByIsDeletedFalse();
    List<Loaiphong> findByIsDeletedTrue();
    java.util.Optional<Loaiphong> findByIdAndIsDeletedFalse(Integer id);
}
