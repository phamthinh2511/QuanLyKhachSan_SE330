package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiPhongRequestDto {
    private String tenLoaiPhong;
    private Double donGia;
    private String moTa;
    private Integer sucChuaToiDa;
}
