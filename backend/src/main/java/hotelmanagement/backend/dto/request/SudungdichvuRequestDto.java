package hotelmanagement.backend.dto.request;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SudungdichvuRequestDto {
    private String bookingCode;
    private String roomNumber;
    private String serviceName;
    private Integer quantity;
    private Double unitPrice;
    private Double total;
    private LocalDate date;
    private String status;
}
