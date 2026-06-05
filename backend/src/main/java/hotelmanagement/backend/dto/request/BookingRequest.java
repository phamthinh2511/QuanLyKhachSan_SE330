package hotelmanagement.backend.dto.request;


import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.FutureOrPresent;
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
    private Integer id;
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
    @FutureOrPresent(message = "Ngày nhận phòng phải là ngày hôm nay hoặc các ngày trong tương lai")
    private LocalDate ngayNhan;
    @NotNull(message = "Ngày trả phòng không được để trống")
    private LocalDate ngayTra;
    @NotNull(message = "Đơn giá không được để trống")
    private Double donGia;
    private Integer soKhach;
    private String trangThai;
    @AssertTrue(message = "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày!")
    public boolean isNgayTraHopLe() {
        if (ngayNhan == null || ngayTra == null) {
            return true;
        }
        return ngayTra.isAfter(ngayNhan);
    }
}
