package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "phong")
public class Phong {
    @Id
    @Column(name = "MaPhong", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaLoaiPhong", nullable = false)
    private Loaiphong maLoaiPhong;

    @Size(max = 50)
    @NotNull
    @Column(name = "TrangThai", nullable = false, length = 50)
    private String trangThai;

    @NotNull
    @Column(name = "SoTang", nullable = false)
    private Integer soTang;

    @NotNull
    @Column(name = "SucChua", nullable = false)
    private Integer sucChua;


}