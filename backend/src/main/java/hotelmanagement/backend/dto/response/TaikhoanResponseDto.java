package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TaikhoanResponseDto {
    private Integer id;
    private String username;
    private String role;
    private String createdAt;
}