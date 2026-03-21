package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "kiemkephong")
public class Kiemkephong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaKiemKe", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhieuThue", nullable = false)
    private Phieuthuephong maPhieuThue;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhong", nullable = false)
    private Phong maPhong;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    private Nhanvien maNhanVien;

    @NotNull
    @Column(name = "NgayKiemKe", nullable = false)
    private LocalDate ngayKiemKe;

    @Size(max = 100)
    @NotNull
    @Column(name = "TinhTrang", nullable = false, length = 100)
    private String tinhTrang;

    @NotNull
    @Column(name = "TienBoiThuong", nullable = false)
    private Double tienBoiThuong;

    @Size(max = 200)
    @NotNull
    @Column(name = "GhiChu", nullable = false, length = 200)
    private String ghiChu;


}