package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanvienRequestDto {
    @NotBlank(message = "Full name cannot be blank")
    private String hoTen;

    @NotBlank(message = "Date of birth cannot be blank")
    private String ngaySinh;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String soDienThoai;

    @NotBlank(message = "Job title cannot be blank")
    private String chucVu;

    @NotBlank(message = "Department cannot be blank")
    private String phongBan;

    @NotBlank(message = "Hire date cannot be blank")
    private String ngayVaoLam;

    @NotBlank(message = "Status cannot be blank")
    private String trangThai;

    @NotBlank(message = "Username cannot be blank")
    private String tenDangNhap;

    @NotBlank(message = "Password cannot be blank")
    private String matKhau;

    @NotBlank(message = "Account type cannot be blank")
    private String loaiTaiKhoan;
}