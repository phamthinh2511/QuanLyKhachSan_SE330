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

    @Size(max = 15)
    @NotNull
    @Column(name = "SoDienThoai", nullable = false, length = 15)
    private String soDienThoai;

    @Size(max = 50)
    @NotNull
    @Column(name = "ChucVu", nullable = false, length = 50)
    private String chucVu;

    @NotNull
    @Column(name = "MaTaiKhoan", nullable = false)
    private Integer maTaiKhoan;


}