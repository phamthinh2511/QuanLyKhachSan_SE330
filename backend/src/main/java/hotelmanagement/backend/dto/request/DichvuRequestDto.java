package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DichvuRequestDto {
    private String tenDichVu;
    private Double giaDichVu;
    private String moTa;
}
