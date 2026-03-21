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
@Table(name = "taikhoan")
public class Taikhoan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaTaiKhoan", nullable = false)
    private Integer id;


    @Size(max = 50)
    @NotNull
    @Column(name = "TenDangNhap", nullable = false, length = 50)
    private String tenDangNhap;

    @Size(max = 100)
    @NotNull
    @Column(name = "MatKhau", nullable = false, length = 100)
    private String matKhau;

    @Size(max = 50)
    @NotNull
    @Column(name = "LoaiTaiKhoan", nullable = false, length = 50)
    private String loaiTaiKhoan;

    @NotNull
    @Column(name = "NgayTao", nullable = false)
    private LocalDate ngayTao;


}