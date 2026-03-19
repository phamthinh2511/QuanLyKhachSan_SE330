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
@Table(name = "phieuthuephong")
public class Phieuthuephong {
    @Id
    @Column(name = "MaPhieuThue", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaDatPhong", nullable = false)
    private Datphong maDatPhong;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaKhachHang", nullable = false)
    private Khachhang maKhachHang;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaNhanVien", nullable = false)
    private Nhanvien maNhanVien;

    @NotNull
    @Column(name = "NgayNhanPhong", nullable = false)
    private LocalDate ngayNhanPhong;

    @NotNull
    @Column(name = "NgayTraPhong", nullable = false)
    private LocalDate ngayTraPhong;

    @Size(max = 50)
    @NotNull
    @Column(name = "TrangThai", nullable = false, length = 50)
    private String trangThai;


}