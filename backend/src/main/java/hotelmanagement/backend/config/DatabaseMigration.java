package hotelmanagement.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * Tự động sửa các constraint database cho phù hợp với logic nghiệp vụ.
 * - ct_hoadon.MaDichVu: cho phép NULL (chi phí tiền phòng không có dịch vụ liên kết)
 * - phieuthuephong.MaDatPhong: cho phép NULL (thuê trực tiếp tại quầy không qua đặt trước)
 */
@Component
public class DatabaseMigration implements CommandLineRunner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String... args) {
        try {
            // Cho phép MaDichVu = NULL trong bảng ct_hoadon (tiền phòng không liên kết dịch vụ)
            // PostgreSQL lưu tên cột lowercase khi không có quotes
            jdbcTemplate.execute("ALTER TABLE ct_hoadon ALTER COLUMN madichvu DROP NOT NULL");
            System.out.println("[DB Migration] ct_hoadon.madichvu => nullable OK");
        } catch (Exception e) {
            System.out.println("[DB Migration] ct_hoadon.madichvu: " + e.getMessage());
        }

        try {
            // Cho phép MaDatPhong = NULL trong bảng phieuthuephong (thuê trực tiếp không qua đặt trước)
            jdbcTemplate.execute("ALTER TABLE phieuthuephong ALTER COLUMN madatphong DROP NOT NULL");
            System.out.println("[DB Migration] phieuthuephong.madatphong => nullable OK");
        } catch (Exception e) {
            System.out.println("[DB Migration] phieuthuephong.madatphong: " + e.getMessage());
        }

        try {
            // Thêm cột phuong_thuc_thanh_toan và trang_thai vào bảng hoadon
            jdbcTemplate.execute("ALTER TABLE hoadon ADD COLUMN IF NOT EXISTS phuong_thuc_thanh_toan VARCHAR(50)");
            jdbcTemplate.execute("ALTER TABLE hoadon ADD COLUMN IF NOT EXISTS trang_thai VARCHAR(50)");
            System.out.println("[DB Migration] hoadon phuong_thuc_thanh_toan, trang_thai columns => OK");
        } catch (Exception e) {
            System.out.println("[DB Migration] hoadon columns: " + e.getMessage());
        }

        try {
            // Thêm index cho NgayThanhToan trong bảng hoadon
            jdbcTemplate.execute("CREATE INDEX IF NOT EXISTS idx_hoadon_ngaythanhtoan ON hoadon (ngaythanhtoan)");
            System.out.println("[DB Migration] Index idx_hoadon_ngaythanhtoan => OK");
        } catch (Exception e) {
            System.out.println("[DB Migration] Index idx_hoadon_ngaythanhtoan error: " + e.getMessage());
        }

        // Reset sequence loaiphong để tránh duplicate key
        try {
            jdbcTemplate.execute(
                "SELECT setval('loaiphong_maloaiphong_seq', COALESCE((SELECT MAX(maloaiphong) FROM loaiphong), 0) + 1, false)"
            );
            System.out.println("[DB Migration] loaiphong sequence reset => OK");
        } catch (Exception e) {
            System.out.println("[DB Migration] loaiphong sequence reset: " + e.getMessage());
        }
    }
}

