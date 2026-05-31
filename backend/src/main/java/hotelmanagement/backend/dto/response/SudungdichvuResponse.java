package hotelmanagement.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho phản hồi thêm dịch vụ phát sinh
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SudungdichvuResponse {
    private Integer id;
    private Integer maPhieuThue;
    private Integer maDichVu;
    private String tenDichVu;
    private Integer maPhong;
    private Integer soLuong;
    private Double donGia;
    private Double thanhTien;
    private String ngaySuDung;
    private String message;
}
