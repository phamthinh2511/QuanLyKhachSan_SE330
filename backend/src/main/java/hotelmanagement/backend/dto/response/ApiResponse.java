package hotelmanagement.backend.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private int code = 200;
    private String message;
    private T result;

    // Thêm các constructor hoặc builder methods thủ công nếu cần,
    // nhưng để đơn giản, chúng ta sẽ dựa vào AllArgsConstructor.
    // Ví dụ, một static factory method để tạo response thành công:
    public static <T> ApiResponse<T> success(T result) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setResult(result);
        return response;
    }

    public static <T> ApiResponse<T> success(T result, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setResult(result);
        response.setMessage(message);
        return response;
    }
    
    public static <T> ApiResponse<T> error(int code, String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setCode(code);
        response.setMessage(message);
        return response;
    }
}
