package hotelmanagement.backend.dto.request;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachhangRequestDto {
    private String name;
    private String phone;
    private String gender;
    private String birthday;
    private String address;
    private String email;
    private String idCard;
    private String type;
}