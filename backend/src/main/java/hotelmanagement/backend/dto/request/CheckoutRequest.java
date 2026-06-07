package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO cho yêu cầu check-out khách
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    @NotNull(message = "Mã phiếu thuê không được để trống")
    private Integer maPhieuThue;

    @NotNull(message = "Mã nhân viên không được để trống")
    private Integer maNhanVien;

    private String phuongThucThanhToan; // "Tiền mặt" | "Thẻ" | "Chuyển khoản"
}
