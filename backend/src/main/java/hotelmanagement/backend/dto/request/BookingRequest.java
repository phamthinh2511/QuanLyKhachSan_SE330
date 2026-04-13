package hotelmanagement.backend.dto.request;


import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class BookingRequest {
    private Integer maKhachHang;
    private LocalDate ngayNhan;
    private LocalDate ngayTra;
    private List<Integer> dsMaPhong;
}
