package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanvienRequestDto {
    private String hoTen;
    private String ngaySinh;
    private String email;
    private String soDienThoai;
    private String chucVu;
    private String phongBan;
    private String ngayVaoLam;
    private String trangThai;
    private Integer maTaiKhoan;

}
