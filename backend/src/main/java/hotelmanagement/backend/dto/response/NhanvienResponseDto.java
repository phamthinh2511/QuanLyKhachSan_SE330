package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanvienResponseDto {
    private String id;
    private String hoTen;
    private String ngaySinh;
    private String email;
    private String soDienThoai;
    private String chucVu;
    private String phongBan;
    private String ngayVaoLam;
    private String trangThai;
}