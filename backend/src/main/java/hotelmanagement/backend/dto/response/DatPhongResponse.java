package hotelmanagement.backend.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DatPhongResponse {
    private Integer id;
    private String bookingCode;
    private String customerName;
    private String roomNumber;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Double amount;
    private String status;
}
