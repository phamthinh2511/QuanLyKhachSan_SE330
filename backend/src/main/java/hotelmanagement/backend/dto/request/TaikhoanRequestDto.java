package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaikhoanRequestDto {
    @NotBlank(message = "Username cannot be blank")
    private String username;

    private String password;

    @NotBlank(message = "Role cannot be blank")
    @Pattern(regexp = "^(ADMIN|NHAN_VIEN)$", message = "Role must be either 'ADMIN' or 'NHAN_VIEN'")
    private String role;
}