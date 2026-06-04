package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DichvuRequestDto {
    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String tenDichVu;

    @NotNull(message = "Giá dịch vụ không được để trống")
    @Min(value = 0, message = "Giá dịch vụ không được nhỏ hơn 0")
    private Double giaDichVu;

    private String moTa;
}
