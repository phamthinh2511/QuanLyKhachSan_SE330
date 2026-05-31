# 📋 HƯỚNG DẪN TEST CÁC API DỊCH VỤ PHÁT SINH & THANH TOÁN

## 🔧 CHUẨN BỊ

### 1. Yêu cầu Database
Đảm bảo các bảng sau có dữ liệu:
- `phieuthuephong` - Phiếu thuê phòng
- `dichvu` - Danh sách dịch vụ
- `phong` - Danh sách phòng
- `nhanvien` - Danh sách nhân viên

### 2. Dữ liệu Mẫu (SQL INSERT)

```sql
-- Insert Dữ liệu Mẫu cho Test

-- Nhân viên
INSERT INTO nhanvien (MaNhanVien, HoTen, NgaySinh, SoDienThoai, ChucVu) 
VALUES (1, 'Nguyễn Văn A', '1990-01-01', '0987654321', 'Quản lý');

-- Loại Phòng
INSERT INTO loaiphong (MaLoaiPhong, TenLoaiPhong, DonGia, MoTa, SucChuaToiDa) 
VALUES (1, 'Phòng Đơn', 500000, 'Phòng cho 1 người', 1);

-- Phòng
INSERT INTO phong (MaPhong, MaLoaiPhong, TrangThai, SoTang) 
VALUES (101, 1, 'Trống', 1);

-- Dịch vụ
INSERT INTO dichvu (MaDichVu, TenDichVu, GiaDichVu, MoTa) 
VALUES 
  (1, 'Đồ ăn & thức uống', 75000, 'Dịch vụ ăn uống phòng'),
  (2, 'Giặt ủi', 50000, 'Dịch vụ giặt ủi quần áo');

-- Khách hàng
INSERT INTO khachhang (MaKhachHang, TenKhachHang, SoDienThoai, GioiTinh, NgaySinh, DiaChi, Email, CCCD, LoaiKhachHang)
VALUES (1, 'Trần Văn B', '0912345678', 'Nam', '1995-05-15', 'Hà Nội', 'b@example.com', '001234567890', 'Tạm trú');

-- Đặt phòng
INSERT INTO datphong (MaDatPhong, MaKhachHang, NgayDat, NgayNhan, NgayTra, TrangThai)
VALUES (1, 1, '2026-05-20', '2026-05-20', '2026-05-22', 'Chưa nhận');

-- Phiếu thuê phòng
INSERT INTO phieuthuephong (MaPhieuThue, MaDatPhong, MaKhachHang, MaNhanVien, NgayNhanPhong, NgayTraPhong, TrangThai)
VALUES (1, 1, 1, 1, '2026-05-20', '2026-05-22', 'Đang ở');

-- Chi tiết Phiếu thuê phòng (tiền phòng)
INSERT INTO ct_phieuthuephong (MaCTPhieuThue, MaPhieuThue, MaPhong, DonGia)
VALUES (1, 1, 101, 1000000.0);
```

---

## 🧪 TEST CÁC API

### Test 1: Thêm Dịch vụ Phát sinh

#### Request
```bash
curl -X POST http://localhost:8080/api/billing/add-service \
  -H "Content-Type: application/json" \
  -d '{
    "maPhieuThue": 1,
    "maDichVu": 1,
    "maPhong": 101,
    "soLuong": 2,
    "donGia": 75000,
    "ngaySuDung": "2026-05-22"
  }'
```

#### Expected Response (Success)
```json
{
  "id": 1,
  "maPhieuThue": 1,
  "maDichVu": 1,
  "tenDichVu": "Đồ ăn & thức uống",
  "maPhong": 101,
  "soLuong": 2,
  "donGia": 75000.0,
  "thanhTien": 150000.0,
  "ngaySuDung": "2026-05-22",
  "message": "Ghi nhận dịch vụ phát sinh thành công"
}
```

#### Validation
- ✅ ID dịch vụ được trả về
- ✅ ThanhTien = soLuong × donGia (2 × 75000 = 150000)
- ✅ Message hiển thị thành công

---

### Test 2: Thêm Dịch vụ Thứ 2

#### Request
```bash
curl -X POST http://localhost:8080/api/billing/add-service \
  -H "Content-Type: application/json" \
  -d '{
    "maPhieuThue": 1,
    "maDichVu": 2,
    "maPhong": 101,
    "soLuong": 1,
    "donGia": 50000,
    "ngaySuDung": "2026-05-22"
  }'
```

#### Expected Response
```json
{
  "id": 2,
  "maPhieuThue": 1,
  "maDichVu": 2,
  "tenDichVu": "Giặt ủi",
  "maPhong": 101,
  "soLuong": 1,
  "donGia": 50000.0,
  "thanhTien": 50000.0,
  "ngaySuDung": "2026-05-22",
  "message": "Ghi nhận dịch vụ phát sinh thành công"
}
```

---

### Test 3: Ghi nhận Kiểm kê Phòng (Bình thường)

#### Request
```bash
curl -X POST http://localhost:8080/api/billing/record-inspection \
  -H "Content-Type: application/json" \
  -d '{
    "maPhieuThue": 1,
    "maPhong": 101,
    "maNhanVien": 1,
    "ngayKiemKe": "2026-05-22",
    "tinhTrang": "Phòng bình thường, không hỏng vỡ",
    "tienBoiThuong": 0,
    "ghiChu": "Kiểm kê lúc 14:30, tất cả đồ dùng còn nguyên"
  }'
```

#### Expected Response
```json
{
  "id": 1,
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 1,
  "ngayKiemKe": "2026-05-22",
  "tinhTrang": "Phòng bình thường, không hỏng vỡ",
  "tienBoiThuong": 0.0,
  "ghiChu": "Kiểm kê lúc 14:30, tất cả đồ dùng còn nguyên",
  "message": "Ghi nhận kiểm kê phòng thành công"
}
```

---

### Test 4: Ghi nhận Kiểm kê Phòng (Có Hỏng Vỡ)

#### Request
```bash
curl -X POST http://localhost:8080/api/billing/record-inspection \
  -H "Content-Type: application/json" \
  -d '{
    "maPhieuThue": 1,
    "maPhong": 101,
    "maNhanVien": 1,
    "ngayKiemKe": "2026-05-22",
    "tinhTrang": "TV bị hỏng màn hình",
    "tienBoiThuong": 5000000,
    "ghiChu": "Màn hình bị vỡ do khách làm hỏng, cần bồi thường"
  }'
```

#### Expected Response
```json
{
  "id": 2,
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 1,
  "ngayKiemKe": "2026-05-22",
  "tinhTrang": "TV bị hỏng màn hình",
  "tienBoiThuong": 5000000.0,
  "ghiChu": "Màn hình bị vỡ do khách làm hỏng, cần bồi thường",
  "message": "Ghi nhận kiểm kê phòng thành công"
}
```

---

### Test 5: Check-out (API CỐT LÕI) ⭐

#### Request
```bash
curl -X POST http://localhost:8080/api/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "maPhieuThue": 1,
    "maNhanVien": 1
  }'
```

#### Expected Response (với dữ liệu từ các test trên)
```json
{
  "maHoaDon": 1,
  "maPhieuThue": 1,
  "maNhanVien": 1,
  "ngayThanhToan": "2026-05-22",
  "tienPhong": 1000000.0,
  "tienDichVu": 200000.0,
  "tienPhat": 5000000.0,
  "tongTien": 6200000.0,
  "chiTietHoaDon": [
    {
      "id": 1,
      "loaiChiPhi": "Tiền phòng",
      "soLuong": 1,
      "donGia": 1000000.0,
      "thanhTien": 1000000.0
    },
    {
      "id": 2,
      "maDichVu": 1,
      "tenDichVu": "Đồ ăn & thức uống",
      "loaiChiPhi": "Dịch vụ",
      "soLuong": 2,
      "donGia": 75000.0,
      "thanhTien": 150000.0
    },
    {
      "id": 3,
      "maDichVu": 2,
      "tenDichVu": "Giặt ủi",
      "loaiChiPhi": "Dịch vụ",
      "soLuong": 1,
      "donGia": 50000.0,
      "thanhTien": 50000.0
    },
    {
      "id": 4,
      "loaiChiPhi": "Tiền phạt/Bồi thường",
      "soLuong": 1,
      "donGia": 5000000.0,
      "thanhTien": 5000000.0
    }
  ],
  "message": "Check-out thành công. Hóa đơn đã được xuất"
}
```

#### Validation Cho Check-out
```
✅ Tiền phòng: 1,000,000 (từ CtPhieuthuephong)
✅ Tiền dịch vụ: 200,000 (150,000 + 50,000 từ Sudungdichvu)
✅ Tiền phạt: 5,000,000 (từ Kiemkephong - test thứ 2)
✅ Tổng tiền: 6,200,000 (1,000,000 + 200,000 + 5,000,000)
✅ Chi tiết hóa đơn: 4 mục (1 phòng + 2 dịch vụ + 1 phạt)
✅ MaHoaDon được tạo tự động
✅ Hóa đơn lưu vào database thành công
```

---

## 🔍 KIỂM TRA TRONG DATABASE

Sau khi test xong, verify dữ liệu:

```sql
-- Kiểm tra Sudungdichvu
SELECT * FROM sudungdichvu WHERE MaPhieuThue = 1;
-- Kỳ vọng: 2 bản ghi (2 dịch vụ được thêm)

-- Kiểm tra Kiemkephong
SELECT * FROM kiemkephong WHERE MaPhieuThue = 1;
-- Kỳ vọng: 2 bản ghi (1 bình thường, 1 có hỏng vỡ)

-- Kiểm tra Hoadon
SELECT * FROM hoadon WHERE MaPhieuThue = 1;
-- Kỳ vọng: 1 bản ghi với TongTien = 6,200,000

-- Kiểm tra CtHoadon
SELECT * FROM ct_hoadon WHERE MaHoaDon = 1;
-- Kỳ vọng: 4 bản ghi chi tiết
```

---

## 🐛 TROUBLESHOOTING

### Lỗi 1: "Phiếu thuê phòng không tồn tại"
**Nguyên nhân:** maPhieuThue không có trong DB
**Giải pháp:** Đảm bảo đã insert dữ liệu mẫu phieuthuephong

### Lỗi 2: "Dịch vụ không tồn tại"
**Nguyên nhân:** maDichVu không có trong DB
**Giải pháp:** Đảm bảo đã insert dữ liệu mẫu dichvu

### Lỗi 3: "Phòng không tồn tại"
**Nguyên nhân:** maPhong không có trong DB
**Giải pháp:** Đảm bảo đã insert dữ liệu mẫu phong

### Lỗi 4: "Nhân viên không tồn tại"
**Nguyên nhân:** maNhanVien không có trong DB
**Giải pháp:** Đảm bảo đã insert dữ liệu mẫu nhanvien

---

## 📊 TÍNH TOÁN KIỂM CHỨNG

### Ví dụ Tính Toán Cho Test Trên

**Dữ liệu:**
- Phòng: 1,000,000 (CtPhieuthuephong)
- Dịch vụ 1: 2 × 75,000 = 150,000
- Dịch vụ 2: 1 × 50,000 = 50,000
- Phạt: 5,000,000

**Tính toán:**
```
Tiền phòng = 1,000,000
Tiền dịch vụ = 150,000 + 50,000 = 200,000
Tiền phạt = 5,000,000
Tổng tiền = 1,000,000 + 200,000 + 5,000,000 = 6,200,000 ✅
```

---

## ✅ CHECKLIST TEST HOÀN CHỈNH

- [ ] Insert dữ liệu mẫu vào database
- [ ] Start Backend Server
- [ ] Test API 1 - Thêm dịch vụ (lần 1)
- [ ] Test API 1 - Thêm dịch vụ (lần 2)
- [ ] Verify Sudungdichvu có 2 bản ghi
- [ ] Test API 2 - Ghi nhận kiểm kê (bình thường)
- [ ] Test API 2 - Ghi nhận kiểm kê (hỏng vỡ)
- [ ] Verify Kiemkephong có 2 bản ghi
- [ ] Test API 3 - Check-out
- [ ] Verify Hoadon có 1 bản ghi
- [ ] Verify CtHoadon có 4 bản ghi chi tiết
- [ ] Kiểm tra tổng tiền tính toán chính xác

---

**Ngày tạo:** 22/05/2026
**Status:** ✅ READY FOR TEST
