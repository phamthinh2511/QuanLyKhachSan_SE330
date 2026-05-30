package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "loaiphong")
public class Loaiphong {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaLoaiPhong", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "TenLoaiPhong", nullable = false, length = 100)
    private String tenLoaiPhong;

    @NotNull
    @Column(name = "DonGia", nullable = false)
    private Double donGia;

    @Size(max = 200)
    @NotNull
    @Column(name = "MoTa", nullable = false, length = 200)
    private String moTa;

    @NotNull
    @Column(name = "SucChuaToiDa", nullable = false)
    private Integer sucChuaToiDa;


}