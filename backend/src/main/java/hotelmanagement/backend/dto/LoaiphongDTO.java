package hotelmanagement.backend.dto;

import lombok.*;
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiphongDTO{
    private Integer id;
    private String name;
    private Double price;
    private String description;
    private Integer capacity;
}
