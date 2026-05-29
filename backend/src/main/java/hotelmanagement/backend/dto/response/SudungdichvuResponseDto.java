package hotelmanagement.backend.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SudungdichvuResponseDto {
    private Integer id;
    private String usageCode;
    private String bookingCode;
    private String customerName;
    private String roomNumber;
    private String serviceName;
    private Integer quantity;
    private Double unitPrice;
    private Double total;
    private LocalDate date;
    private String status;
}
