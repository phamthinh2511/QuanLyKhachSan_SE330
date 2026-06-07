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
@Table(name = "nhanvien")
public class Nhanvien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaNhanVien", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "HoTen", nullable = false, length = 100)
    private String hoTen;

    @NotNull
    @Column(name = "NgaySinh", nullable = false)
    private LocalDate ngaySinh;

    @Size(max = 100)
    @Column(name = "Email", length = 100)
    private String email;

    @Size(max = 15)
    @NotNull
    @Column(name = "SoDienThoai", nullable = false, length = 15)
    private String soDienThoai;

    @Size(max = 50)
    @NotNull
    @Column(name = "ChucVu", nullable = false, length = 50)
    private String chucVu;

    @Size(max = 50)
    @Column(name = "PhongBan", length = 50)
    private String phongBan;

    @Column(name = "NgayVaoLam")
    private LocalDate ngayVaoLam;

    @Size(max = 50)
    @Column(name = "TrangThai", length = 50)
    private String trangThai;

    @OneToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "MaTaiKhoan", nullable = false, unique = true)
    private Taikhoan taikhoan;

    @NotNull
    @Column(name = "is_deleted", nullable = false, columnDefinition = "boolean default false")
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private java.time.LocalDateTime deletedAt;
}