package hotelmanagement.backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO cho phản hồi check-out: hóa đơn cuối cùng
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private Integer maHoaDon;
    private Integer maPhieuThue;
    private Integer maNhanVien;
    private String ngayThanhToan;
    private Double tienPhong;
    private Double tienDichVu;
    private Double tienPhat;
    private Double tongTien;
    private List<CtHoadonDetailResponse> chiTietHoaDon;
    private String message;
}
