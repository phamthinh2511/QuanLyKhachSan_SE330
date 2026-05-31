-- ============================================================
-- SQL SCRIPT: Insert Test Data for Billing APIs
-- Person 3: Service Usage & Billing (Dịch vụ phát sinh & Thanh toán)
-- ============================================================
-- This script inserts sample data to test the 3 APIs:
-- 1. Add Service Usage
-- 2. Record Inspection  
-- 3. Checkout (Core Logic)
-- ============================================================

-- Step 1: Insert Staff Member (Nhân viên)
INSERT INTO nhanvien (MaNhanVien, HoTen, NgaySinh, SoDienThoai, ChucVu) 
VALUES (1, 'Nguyễn Văn An', '1990-01-15', '0987654321', 'Quản lý lễ tân');

-- Step 2: Insert Room Type (Loại phòng)
INSERT INTO loaiphong (MaLoaiPhong, TenLoaiPhong, DonGia, MoTa, SucChuaToiDa) 
VALUES (1, 'Phòng Đơn Tiêu Chuẩn', 500000, 'Phòng cho 1 người, tiện nghi cơ bản', 1);

-- Step 3: Insert Rooms (Phòng)
INSERT INTO phong (MaPhong, MaLoaiPhong, TrangThai, SoTang) 
VALUES 
  (101, 1, 'Trống', 1),
  (102, 1, 'Trống', 1);

-- Step 4: Insert Services (Dịch vụ)
INSERT INTO dichvu (MaDichVu, TenDichVu, GiaDichVu, MoTa) 
VALUES 
  (1, 'Đồ ăn & thức uống phòng', 75000, 'Dịch vụ mang đồ ăn, thức uống đến phòng'),
  (2, 'Giặt ủi quần áo', 50000, 'Dịch vụ giặt ủi quần áo khách hàng');

-- Step 5: Insert Customer (Khách hàng)
INSERT INTO khachhang (
  MaKhachHang, TenKhachHang, SoDienThoai, GioiTinh, 
  NgaySinh, DiaChi, Email, CCCD, LoaiKhachHang
) 
VALUES (
  1, 'Trần Văn Bảo', '0912345678', 'Nam', 
  '1995-05-15', '123 Đường Hàng Bạc, Hà Nội', 'baotran@example.com', 
  '001234567890', 'Tạm trú'
);

-- Step 6: Insert Booking (Đặt phòng)
INSERT INTO datphong (MaDatPhong, MaKhachHang, NgayDat, NgayNhan, NgayTra, TrangThai) 
VALUES (
  1, 1, '2026-05-20', '2026-05-20', '2026-05-22', 'Đã xác nhận'
);

-- Step 7: Insert Room Rental Voucher (Phiếu thuê phòng)
INSERT INTO phieuthuephong (
  MaPhieuThue, MaDatPhong, MaKhachHang, MaNhanVien, 
  NgayNhanPhong, NgayTraPhong, TrangThai
) 
VALUES (
  1, 1, 1, 1, 
  '2026-05-20', '2026-05-22', 'Đang ở'
);

-- Step 8: Insert Room Rental Details (Chi tiết phiếu thuê)
-- This is the ROOM FEE (Tiền phòng) that will be summed in checkout
INSERT INTO ct_phieuthuephong (MaCTPhieuThue, MaPhieuThue, MaPhong, DonGia) 
VALUES (
  1, 1, 101, 1000000.0  -- Room fee for 2 nights at 500,000/night
);

-- ============================================================
-- TEST DATA READY
-- ============================================================
-- 
-- Now you can test the APIs:
--
-- 1. TEST API 1: Add Service Usage (Thêm dịch vụ phát sinh)
--    POST /api/billing/add-service
--    
--    Request 1: Add food service
--    {
--      "maPhieuThue": 1,
--      "maDichVu": 1,
--      "maPhong": 101,
--      "soLuong": 2,
--      "donGia": 75000,
--      "ngaySuDung": "2026-05-22"
--    }
--    
--    Request 2: Add laundry service
--    {
--      "maPhieuThue": 1,
--      "maDichVu": 2,
--      "maPhong": 101,
--      "soLuong": 1,
--      "donGia": 50000,
--      "ngaySuDung": "2026-05-22"
--    }
--
-- 2. TEST API 2: Record Room Inspection (Ghi nhận kiểm kê)
--    POST /api/billing/record-inspection
--    
--    Request 1: Normal room (no damage)
--    {
--      "maPhieuThue": 1,
--      "maPhong": 101,
--      "maNhanVien": 1,
--      "ngayKiemKe": "2026-05-22",
--      "tinhTrang": "Phòng bình thường, không hỏng vỡ",
--      "tienBoiThuong": 0,
--      "ghiChu": "Tất cả đồ dùng còn nguyên vẹn"
--    }
--    
--    Request 2 (Optional): Room with damage
--    {
--      "maPhieuThue": 1,
--      "maPhong": 101,
--      "maNhanVien": 1,
--      "ngayKiemKe": "2026-05-22",
--      "tinhTrang": "TV bị hỏng màn hình",
--      "tienBoiThuong": 5000000,
--      "ghiChu": "Màn hình bị vỡ, cần bồi thường"
--    }
--
-- 3. TEST API 3: Checkout - Core Logic (Check-out - Cốt lõi)
--    POST /api/billing/checkout
--    
--    Request:
--    {
--      "maPhieuThue": 1,
--      "maNhanVien": 1
--    }
--    
--    Expected Calculation (without damage):
--    - Room Fee (Tiền phòng): 1,000,000
--    - Service Fee (Tiền dịch vụ): (2 × 75,000) + (1 × 50,000) = 200,000
--    - Penalty Fee (Tiền phạt): 0
--    - TOTAL: 1,200,000
--    
--    Expected Calculation (with damage from Request 2):
--    - Room Fee: 1,000,000
--    - Service Fee: 200,000
--    - Penalty Fee: 5,000,000
--    - TOTAL: 6,200,000
--
-- ============================================================
-- VERIFICATION QUERIES (Run after testing)
-- ============================================================
--
-- Verify Service Usage Data (Dịch vụ phát sinh)
-- SELECT * FROM sudungdichvu WHERE MaPhieuThue = 1;
-- Expected: 2 rows (food + laundry)
--
-- Verify Inspection Data (Kiểm kê)
-- SELECT * FROM kiemkephong WHERE MaPhieuThue = 1;
-- Expected: 1-2 rows depending on damage test
--
-- Verify Invoice Created (Hóa đơn)
-- SELECT * FROM hoadon WHERE MaPhieuThue = 1;
-- Expected: 1 row with total amount
--
-- Verify Invoice Details (Chi tiết hóa đơn)
-- SELECT * FROM ct_hoadon WHERE MaHoaDon = 1;
-- Expected: 3-4 rows (room + services + optional penalty)
--
-- Calculate Total (Verify calculation)
-- SELECT 
--   (SELECT COALESCE(SUM(DonGia), 0) FROM ct_phieuthuephong WHERE MaPhieuThue = 1) as TienPhong,
--   (SELECT COALESCE(SUM(ThanhTien), 0) FROM sudungdichvu WHERE MaPhieuThue = 1) as TienDichVu,
--   (SELECT COALESCE(SUM(TienBoiThuong), 0) FROM kiemkephong WHERE MaPhieuThue = 1) as TienPhat,
--   (SELECT COALESCE(SUM(DonGia), 0) FROM ct_phieuthuephong WHERE MaPhieuThue = 1) +
--   (SELECT COALESCE(SUM(ThanhTien), 0) FROM sudungdichvu WHERE MaPhieuThue = 1) +
--   (SELECT COALESCE(SUM(TienBoiThuong), 0) FROM kiemkephong WHERE MaPhieuThue = 1) as TongTien;
--
-- ============================================================
-- CLEANUP (If you need to reset test data)
-- ============================================================
--
-- DELETE FROM ct_hoadon WHERE MaHoaDon IN (SELECT MaHoaDon FROM hoadon WHERE MaPhieuThue = 1);
-- DELETE FROM hoadon WHERE MaPhieuThue = 1;
-- DELETE FROM sudungdichvu WHERE MaPhieuThue = 1;
-- DELETE FROM kiemkephong WHERE MaPhieuThue = 1;
-- DELETE FROM ct_phieuthuephong WHERE MaPhieuThue = 1;
-- DELETE FROM phieuthuephong WHERE MaPhieuThue = 1;
-- DELETE FROM datphong WHERE MaDatPhong = 1;
-- DELETE FROM khachhang WHERE MaKhachHang = 1;
-- DELETE FROM phong WHERE MaPhong IN (101, 102);
-- DELETE FROM loaiphong WHERE MaLoaiPhong = 1;
-- DELETE FROM dichvu WHERE MaDichVu IN (1, 2);
-- DELETE FROM nhanvien WHERE MaNhanVien = 1;
--
-- ============================================================
-- NOTES
-- ============================================================
-- - All data inserted with sample values
-- - MaPhieuThue = 1 is used for all tests
-- - MaNhanVien = 1 (Nguyễn Văn An)
-- - MaPhong = 101
-- - Room fee is 1,000,000 for 2 nights
-- - Service fees are added via API calls
-- - Inspection is recorded via API call
-- - Checkout creates invoice automatically
-- ============================================================

-- Total records inserted: 11 rows across 7 tables
-- Ready for API testing
-- Date: 2026-05-22
-- Status: READY TO TEST
