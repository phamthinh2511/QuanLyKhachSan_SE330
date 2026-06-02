package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "hoadon")
public class Hoadon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaHoaDon", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhieuThue", nullable = false)
    private Phieuthuephong maPhieuThue;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    private Nhanvien maNhanVien;

    @Column(name = "NgayThanhToan", nullable = true)
    private LocalDate ngayThanhToan;

    @NotNull
    @Column(name = "TongTien", nullable = false)
    private Double tongTien;

    @Column(name = "phuong_thuc_thanh_toan", length = 50)
    private String phuongThucThanhToan;

    @Column(name = "trang_thai", length = 50)
    private String trangThai;
}