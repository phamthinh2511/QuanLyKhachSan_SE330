package hotelmanagement.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "dichvu")
public class Dichvu {
    @Id
    @Column(name = "MaDichVu", nullable = false)
    private Integer id;

    @Size(max = 100)
    @NotNull
    @Column(name = "TenDichVu", nullable = false, length = 100)
    private String tenDichVu;

    @NotNull
    @Column(name = "GiaDichVu", nullable = false)
    private Double giaDichVu;

    @Size(max = 200)
    @NotNull
    @Column(name = "MoTa", nullable = false, length = 200)
    private String moTa;

    @NotNull
    @Column(name = "is_deleted", nullable = false, columnDefinition = "boolean default false")
    private Boolean isDeleted = false;

    @Column(name = "deleted_at")
    private java.time.LocalDateTime deletedAt;

}