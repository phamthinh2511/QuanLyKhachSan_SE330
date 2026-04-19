package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhongRequestDto {
    private Integer id;
    private Integer maLoaiPhong;
    private LoaiPhongRequestDto loaiPhong; // Thêm lại để tương thích với frontend gửi object loaiPhong
    private String trangThai;
    private Integer soTang;
    private Integer sucChua;
}
