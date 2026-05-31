package hotelmanagement.backend.dto.response;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvoiceResponseDto {
    private Integer id;
    private String invoiceCode;
    private String bookingCode;
    private String customerName;
    private String roomNumber;
    private Double roomCost;
    private Double serviceCost;
    private Double total;
    private String paymentMethod;
    private String status;
    private LocalDate createdAt;
    private List<SudungdichvuResponseDto> serviceUsages;
}
