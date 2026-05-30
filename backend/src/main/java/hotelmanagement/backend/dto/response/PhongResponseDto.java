package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhongResponseDto {
    private Integer id;
    private LoaiPhongResponseDto maLoaiPhong;
    private String trangThai;
    private Integer soTang;
    private Integer sucChua;
}
