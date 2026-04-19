package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaikhoanRequestDto {
    private String username;
    private String password;
    private String role;
}