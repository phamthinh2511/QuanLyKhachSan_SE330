package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PhongRepository extends JpaRepository<Phong, Integer> {

    @Modifying (clearAutomatically = true)
    @Query("UPDATE Phong p set p.trangThai = :status WHERE p.id= :id")
    void updatePhongStatus(@Param("id") Integer id, @Param("status") String status);

}
