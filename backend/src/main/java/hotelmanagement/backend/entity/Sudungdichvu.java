package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "sudungdichvu")
public class Sudungdichvu {
    @Id
    @Column(name = "MaSuDungDichVu", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhieuThue", nullable = false)
    private Phieuthuephong maPhieuThue;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaDichVu", nullable = false)
    private Dichvu maDichVu;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "MaPhong", nullable = false)
    private Phong maPhong;

    @NotNull
    @Column(name = "SoLuong", nullable = false)
    private Integer soLuong;

    @NotNull
    @Column(name = "DonGia", nullable = false)
    private Double donGia;

    @NotNull
    @Column(name = "ThanhTien", nullable = false)
    private Double thanhTien;

    @NotNull
    @Column(name = "NgaySuDung", nullable = false)
    private LocalDate ngaySuDung;


}