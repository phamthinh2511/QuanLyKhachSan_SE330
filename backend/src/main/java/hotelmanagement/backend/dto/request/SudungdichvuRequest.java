package hotelmanagement.backend.dto.request;

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
    private Integer maPhieuThue;
    private Integer maDichVu;
    private Integer maPhong;
    private Integer soLuong;
    private Double donGia;
    private LocalDate ngaySuDung;
}
