package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "khachhang")
public class Khachhang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaKhachHang", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "TenKhachHang", nullable = false, length = 100)
    private String tenKhachHang;

    @Size(max = 15)
    @NotNull
    @Column(name = "SoDienThoai", nullable = false, length = 15)
    private String soDienThoai;

    @Size(max = 10)
    @NotNull
    @Column(name = "GioiTinh", nullable = false, length = 10)
    private String gioiTinh;

    @NotNull
    @Column(name = "NgaySinh", nullable = false)
    private LocalDate ngaySinh;

    @Size(max = 200)
    @NotNull
    @Column(name = "DiaChi", nullable = false, length = 200)
    private String diaChi;

    @Size(max = 100)
    @NotNull
    @Column(name = "Email", nullable = false, length = 100)
    private String email;

    @Size(max = 12)
    @NotNull
    @Column(name = "CCCD", nullable = false, length = 12)
    private String cccd;

    @Size(max = 50)
    @NotNull
    @Column(name = "LoaiKhachHang", nullable = false, length = 50)
    private String loaiKhachHang;

    @NotNull
    @Column(name = "is_deleted", nullable = false, columnDefinition = "boolean default false")
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private java.time.LocalDateTime deletedAt;

}