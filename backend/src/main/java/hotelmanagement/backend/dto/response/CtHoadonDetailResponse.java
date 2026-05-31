package hotelmanagement.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho chi tiết hóa đơn
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CtHoadonDetailResponse {
    private Integer id;
    private Integer maPhong;
    private Integer maDichVu;
    private String tenDichVu;
    private String loaiChiPhi;
    private Integer soLuong;
    private Double donGia;
    private Double thanhTien;
}
