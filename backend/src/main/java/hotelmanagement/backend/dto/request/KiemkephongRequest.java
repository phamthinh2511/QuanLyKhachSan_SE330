package hotelmanagement.backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho yêu cầu ghi nhận kiểm kê phòng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KiemkephongRequest {
    private Integer maPhieuThue;
    private Integer maPhong;
    private Integer maNhanVien;
    private LocalDate ngayKiemKe;
    private String tinhTrang;
    private Double tienBoiThuong;
    private String ghiChu;
}
