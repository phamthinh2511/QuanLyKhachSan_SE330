package hotelmanagement.backend.dto.request;

import lombok.Data;

@Data
public class InvoiceRequestDto {
    private String bookingCode;
    private String paymentMethod;
}
