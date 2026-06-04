package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class InvoiceRequestDto {
    @NotBlank(message = "Mã đặt phòng không được để trống")
    private String bookingCode;

    @NotBlank(message = "Phương thức thanh toán không được để trống")
    private String paymentMethod;
}
