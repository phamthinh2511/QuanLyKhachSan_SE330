package hotelmanagement.backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachhangRequestDto {
    @NotBlank(message = "Customer name cannot be blank")
    private String name;

    @NotBlank(message = "Phone number cannot be blank")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be exactly 10 digits")
    private String phone;

    @NotBlank(message = "Gender cannot be blank")
    private String gender;

    @NotBlank(message = "Birthday cannot be blank")
    private String birthday;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "ID Card/Passport number cannot be blank")
    @Pattern(regexp = "^[0-9]{9,12}$", message = "ID Card must be between 9 and 12 digits")
    private String idCard;

    @NotBlank(message = "Customer type cannot be blank")
    private String type;
}