package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DichvuResponseDto {
    private Integer id;
    private String tenDichVu;
    private Double giaDichVu;
    private String moTa;
}
