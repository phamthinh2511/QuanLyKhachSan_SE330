package hotelmanagement.backend.dto.response;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhieuthuephongResponseDto {
    private Integer id;
    private String rentalCode;
    private String bookingCode;
    private Integer customerId;
    private String customerName;
    private Integer employeeId;
    private String employeeName;
    private String roomNumber;
    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer guests;
    private Double roomPrice;
    private String status;
    private java.util.List<SudungdichvuResponseDto> serviceUsages;
}
