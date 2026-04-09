package hotelmanagement.backend.dto.response;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachhangResponseDto {
    private Integer id;
    private String name;
    private String phone;
    private String gender;
    private String birthday;
    private String address;
    private String email;
    private String idCard;
    private String type;
}