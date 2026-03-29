package hotelmanagement.backend.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachhangDTO {
    private Integer id;
    private String name;        // ← tenKhachHang
    private String phone;       // ← soDienThoai
    private String gender;      // ← gioiTinh
    private String birthday;    // ← ngaySinh (String để FE dễ xử lý)
    private String address;     // ← diaChi
    private String email;
    private String idCard;      // ← cccd
    private String status;      // ← loaiKhachHang
}