package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

/**
 * DTO cho yêu cầu thêm dịch vụ phát sinh
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SudungdichvuRequest {
    @NotNull(message = "Mã phiếu thuê không được để trống")
    private Integer maPhieuThue;

    @NotNull(message = "Mã dịch vụ không được để trống")
    private Integer maDichVu;

    @NotNull(message = "Mã phòng không được để trống")
    private Integer maPhong;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    private Integer soLuong;

    @NotNull(message = "Đơn giá không được để trống")
    @Min(value = 0, message = "Đơn giá không được nhỏ hơn 0")
    private Double donGia;

    private LocalDate ngaySuDung;
}
