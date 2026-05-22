package hotelmanagement.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho phản hồi ghi nhận kiểm kê phòng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KiemkephongResponse {
    private Integer id;
    private Integer maPhieuThue;
    private Integer maPhong;
    private Integer maNhanVien;
    private String ngayKiemKe;
    private String tinhTrang;
    private Double tienBoiThuong;
    private String ghiChu;
    private String message;
}
