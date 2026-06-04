package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SudungdichvuRequestDto {
    @NotBlank(message = "Mã đặt phòng không được để trống")
    private String bookingCode;

    @NotBlank(message = "Số phòng không được để trống")
    private String roomNumber;

    @NotBlank(message = "Tên dịch vụ không được để trống")
    private String serviceName;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng tối thiểu là 1")
    private Integer quantity;

    @NotNull(message = "Đơn giá không được để trống")
    @Min(value = 0, message = "Đơn giá không được nhỏ hơn 0")
    private Double unitPrice;

    private Double total;

    @NotNull(message = "Ngày sử dụng không được để trống")
    private LocalDate date;

    private String status;
}
