package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "ct_hoadon")
public class CtHoadon {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MaCTHoaDon", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaHoaDon", nullable = false)
    private Hoadon maHoaDon;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhong", nullable = false)
    private Phong maPhong;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaDichVu", nullable = false)
    private Dichvu maDichVu;

    @Size(max = 50)
    @NotNull
    @Column(name = "LoaiChiPhi", nullable = false, length = 50)
    private String loaiChiPhi;

    @NotNull
    @Column(name = "SoLuong", nullable = false)
    private Integer soLuong;

    @NotNull
    @Column(name = "DonGia", nullable = false)
    private Double donGia;

    @NotNull
    @Column(name = "ThanhTien", nullable = false)
    private Double thanhTien;


}