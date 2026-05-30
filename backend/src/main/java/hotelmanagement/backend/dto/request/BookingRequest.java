package hotelmanagement.backend.dto.request;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
public class BookingRequest {
//    private Integer maKhachHang;
//    private LocalDate ngayNhan;
//    private LocalDate ngayTra;
//    private List<Integer> dsMaPhong;
@NotNull(message = "Vai tro khong duoc de trong")
private String role;
    @NotNull(message = "Loai hinh giao dich khong duoc de trong")
    private String loaiHinh;
    @NotNull(message = "Vui long chon khach hang")
    private Integer maKhachHangId;
    @NotNull(message = "Vui lòng chọn phòng")
    private Integer maPhongId;
    private Integer maNhanVienId;
    @NotNull(message = "Ngày nhận phòng không được để trống")
    private LocalDate ngayNhan;
    @NotNull(message = "Ngày trả phòng không được để trống")
    private LocalDate ngayTra;
    @NotNull(message = "Đơn giá không được để trống")
    private Double donGia;
    private Integer soKhach;
    private String trangThai;
}
