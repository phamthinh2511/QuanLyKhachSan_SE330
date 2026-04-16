package hotelmanagement.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PhongDTO {
    private Integer id;
    private String status;
    private Integer floorNumber;
    private Integer capacity;
    private LoaiphongDTO loaiphong;
}
