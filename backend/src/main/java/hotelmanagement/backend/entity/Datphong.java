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
@Table(name = "datphong")
public class Datphong {
    @Id
    @Column(name = "MaDatPhong", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaKhachHang", nullable = false)
    private Khachhang maKhachHang;

    @NotNull
    @Column(name = "NgayDat", nullable = false)
    private LocalDate ngayDat;

    @NotNull
    @Column(name = "NgayNhan", nullable = false)
    private LocalDate ngayNhan;

    @NotNull
    @Column(name = "NgayTra", nullable = false)
    private LocalDate ngayTra;

    @Size(max = 50)
    @NotNull
    @Column(name = "TrangThai", nullable = false, length = 50)
    private String trangThai;


}