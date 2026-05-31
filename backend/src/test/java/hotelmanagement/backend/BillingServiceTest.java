package hotelmanagement.backend;

import hotelmanagement.backend.dto.request.CheckoutRequest;
import hotelmanagement.backend.dto.request.KiemkephongRequest;
import hotelmanagement.backend.dto.request.SudungdichvuRequest;
import hotelmanagement.backend.dto.response.CheckoutResponse;
import hotelmanagement.backend.service.BillingService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Test các API cho Người 3: Dịch vụ phát sinh & Thanh toán
 */
@SpringBootTest
@ActiveProfiles("test")
public class BillingServiceTest {
    
    @Autowired
    private BillingService billingService;
    
    @Test
    public void testAddServiceUsageAPI() {
        // Test thêm dịch vụ phát sinh
        SudungdichvuRequest request = SudungdichvuRequest.builder()
                .maPhieuThue(1)
                .maDichVu(1)
                .maPhong(101)
                .soLuong(2)
                .donGia(50000.0)
                .ngaySuDung(LocalDate.now())
                .build();
        
        // Chạy test (cần dữ liệu mẫu trong DB)
        // var response = billingService.addServiceUsage(request);
        // assertNotNull(response);
        // assertTrue(response.getMessage().contains("thành công"));
    }
    
    @Test
    public void testRecordInspectionAPI() {
        // Test ghi nhận kiểm kê
        KiemkephongRequest request = KiemkephongRequest.builder()
                .maPhieuThue(1)
                .maPhong(101)
                .maNhanVien(1)
                .ngayKiemKe(LocalDate.now())
                .tinhTrang("Phòng bình thường")
                .tienBoiThuong(0.0)
                .ghiChu("Không có hỏng vỡ")
                .build();
        
        // Chạy test (cần dữ liệu mẫu trong DB)
        // var response = billingService.recordRoomInspection(request);
        // assertNotNull(response);
    }
    
    @Test
    public void testCheckoutAPI() {
        // Test API Check-out - cốt lõi
        CheckoutRequest request = CheckoutRequest.builder()
                .maPhieuThue(1)
                .maNhanVien(1)
                .build();
        
        // Chạy test (cần dữ liệu mẫu trong DB)
        // var response = billingService.checkout(request);
        // assertNotNull(response);
        // assertTrue(response.getMessage().contains("thành công"));
        // assertNotNull(response.getMaHoaDon());
        // assertTrue(response.getTongTien() > 0);
    }
}
