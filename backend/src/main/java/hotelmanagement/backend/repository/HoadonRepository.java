package hotelmanagement.backend.repository;

import hotelmanagement.backend.entity.Hoadon;
import hotelmanagement.backend.entity.Phieuthuephong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HoadonRepository extends JpaRepository<Hoadon, Integer> {
    Optional<Hoadon> findByMaPhieuThue(Phieuthuephong maPhieuThue);

    List<Hoadon> findByNgayThanhToanBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT h FROM Hoadon h " +
           "LEFT JOIN h.maPhieuThue pt " +
           "LEFT JOIN pt.maDatPhong dp " +
           "LEFT JOIN pt.maKhachHang kh " +
           "WHERE h.ngayThanhToan BETWEEN :startDate AND :endDate AND " +
           "(:status = '' OR h.trangThai = :status) AND " +
           "(:search = '' OR " +
           " LOWER(CAST(h.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(kh.tenKhachHang) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(CAST(pt.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " (dp IS NOT NULL AND LOWER(CAST(dp.id AS string)) LIKE LOWER(CONCAT('%', :search, '%'))))")
    Page<Hoadon> searchInvoicesWithDate(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);

    @Query("SELECT h FROM Hoadon h " +
           "LEFT JOIN h.maPhieuThue pt " +
           "LEFT JOIN pt.maDatPhong dp " +
           "LEFT JOIN pt.maKhachHang kh " +
           "WHERE (:status = '' OR h.trangThai = :status) AND " +
           "(:search = '' OR " +
           " LOWER(CAST(h.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(kh.tenKhachHang) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(CAST(pt.id AS string)) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " (dp IS NOT NULL AND LOWER(CAST(dp.id AS string)) LIKE LOWER(CONCAT('%', :search, '%'))))")
    Page<Hoadon> searchInvoicesAllTime(
            @Param("search") String search,
            @Param("status") String status,
            Pageable pageable);

    @Query("SELECT COUNT(h) FROM Hoadon h WHERE h.ngayThanhToan BETWEEN :startDate AND :endDate")
    long countInvoicesWithDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COUNT(h) FROM Hoadon h")
    long countInvoicesAllTime();

    @Query("SELECT COALESCE(SUM(h.tongTien), 0.0) FROM Hoadon h WHERE h.ngayThanhToan BETWEEN :startDate AND :endDate")
    double sumTotalAmountWithDate(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0.0) FROM Hoadon h")
    double sumTotalAmountAllTime();

    @Query("SELECT COALESCE(SUM(h.tongTien), 0.0) FROM Hoadon h WHERE h.ngayThanhToan BETWEEN :startDate AND :endDate AND h.trangThai = :status")
    double sumAmountByStatusWithDate(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            @Param("status") String status);

    @Query("SELECT COALESCE(SUM(h.tongTien), 0.0) FROM Hoadon h WHERE h.trangThai = :status")
    double sumAmountByStatusAllTime(@Param("status") String status);

    @Query("SELECT COALESCE(SUM(pt.soKhach), 0L) FROM Hoadon h JOIN h.maPhieuThue pt WHERE h.ngayThanhToan BETWEEN :start AND :end")
    long sumGuestsWithDate(@Param("start") LocalDate start, @Param("end") LocalDate end);

    @Query("SELECT COALESCE(SUM(pt.soKhach), 0L) FROM Hoadon h JOIN h.maPhieuThue pt")
    long sumGuestsAllTime();
}
