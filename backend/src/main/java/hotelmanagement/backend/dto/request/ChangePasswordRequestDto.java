package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChangePasswordRequestDto {
    private String oldPassword;
    private String newPassword;
    private String confirmPassword;
}