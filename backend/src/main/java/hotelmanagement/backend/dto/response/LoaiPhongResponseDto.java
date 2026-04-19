package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoaiPhongResponseDto {
    private Integer id;
    private String tenLoaiPhong;
    private Double donGia;
    private String moTa;
    private Integer sucChuaToiDa;
}
