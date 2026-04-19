package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.CtDatphong;
import hotelmanagement.backend.entity.CtPhieuthuephong;
import hotelmanagement.backend.entity.Datphong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CtPhieuthuephongRepository extends JpaRepository<CtPhieuthuephong, Integer> {

}
