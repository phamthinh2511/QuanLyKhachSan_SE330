# 🔄 CÁC LUỒNG HOẠT ĐỘNG - MODULE BILLING (THANH TOÁN)

## 📌 Tổng quan

Module Billing gồm **3 API chính** với 3 luồng hoạt động riêng biệt, hoạt động tuần tự trong quy trình check-out của khách:

```
┌─────────────────────────────────────────────────────┐
│  KHÁCH Ở TẠI PHÒNG                                  │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  LUỒNG 1: Thêm Dịch vụ Phát sinh                   │
│  (Ghi nhận đồ ăn, giặt ủi, v.v.)                  │
│  Có thể gọi nhiều lần trong quá trình ở            │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  LUỒNG 2: Ghi nhận Kiểm kê Phòng                   │
│  (Kiểm tra hỏng phòng, mất chìa khóa, v.v.)       │
│  Gọi 1 lần trước check-out                         │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  LUỒNG 3: Check-out (CỐT LÕI)                     │
│  Gom tiền từ 3 nguồn → Xuất Hóa đơn               │
└─────────────────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────────────────┐
│  KHÁCH RỜI ĐI - THANH TOÁN XONG                   │
└─────────────────────────────────────────────────────┘
```

---

## 🔹 LUỒNG 1: THÊM DỊCH VỤ PHÁT SINH

### 📖 Mô tả
Ghi nhận các dịch vụ phát sinh mà khách sử dụng trong quá trình ở tại phòng:
- Đồ ăn, thức uống từ phòng
- Dịch vụ giặt ủi
- Dịch vụ spa, massage
- Các dịch vụ khác

**Điểm quan trọng:** Có thể gọi API này **nhiều lần** trong quá trình khách ở.

### 🔄 Quy trình chi tiết

```
┌─────────────────────────────────────────┐
│  INPUT: SudungdichvuRequest             │
├─────────────────────────────────────────┤
│ {                                       │
│   "maPhieuThue": 1,    // ID phiếu     │
│   "maDichVu": 1,       // ID dịch vụ   │
│   "maPhong": 101,      // ID phòng     │
│   "soLuong": 2,        // Số lượng     │
│   "donGia": 75000,     // Giá đơn vị   │
│   "ngaySuDung": "2026-05-22" // Ngày  │
│ }                                       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 1: VALIDATE DỮ LIỆU ĐẦU VÀO    │
└─────────────────────────────────────────┘
            │
    ┌───────┴───────┬───────────────┐
    ▼               ▼               ▼
  Phiếu         Dịch vụ         Phòng
  tồn tại?      tồn tại?        tồn tại?
    │               │               │
    ❌              ❌              ❌ → LỖI
    │               │               │
    ✅              ✅              ✅
    │               │               │
    └───────┬───────┴───────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 2: TÍNH TOÁN THÀNH TIỀN        │
├─────────────────────────────────────────┤
│  ThanhTien = SoLuong × DonGia          │
│  ThanhTien = 2 × 75000 = 150000        │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 3: TẠO BẢN GHI SUDUNGDICHVU    │
├─────────────────────────────────────────┤
│ Sudungdichvu {                          │
│   id: auto,                             │
│   maPhieuThue: 1,                       │
│   maDichVu: 1,                          │
│   maPhong: 101,                         │
│   soLuong: 2,                           │
│   donGia: 75000,                        │
│   thanhTien: 150000,    // Tính sẵn   │
│   ngaySuDung: 2026-05-22 // Mặc định │
│ }                                       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 4: LƯU VÀO DATABASE             │
│  Repository.save(Sudungdichvu)         │
│  ✅ Lưu thành công                     │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  OUTPUT: SudungdichvuResponse           │
├─────────────────────────────────────────┤
│ {                                       │
│   "id": 1,             // ID sinh ra   │
│   "maPhieuThue": 1,                    │
│   "maDichVu": 1,                       │
│   "tenDichVu": "Cơm chiên",           │
│   "maPhong": 101,                      │
│   "soLuong": 2,                        │
│   "donGia": 75000,                     │
│   "thanhTien": 150000, // Tính sẵn   │
│   "ngaySuDung": "2026-05-22",         │
│   "message": "Ghi nhận dịch vụ phát   │
│               sinh thành công"        │
│ }                                       │
└─────────────────────────────────────────┘
```

### 📊 Ảnh hưởng đến Database

| Bảng | Hành động | Chi tiết |
|------|-----------|---------|
| **Sudungdichvu** | INSERT | Thêm 1 bản ghi |
| **Dichvu** | SELECT | Kiểm tra tồn tại |
| **Phong** | SELECT | Kiểm tra tồn tại |
| **Phieuthuephong** | SELECT | Kiểm tra tồn tại |

### ⚠️ Trường hợp lỗi

| Lỗi | Nguyên nhân | Xử lý |
|-----|-----------|-------|
| "Phiếu thuê phòng không tồn tại" | `maPhieuThue` không có trong DB | Return 400 Bad Request |
| "Dịch vụ không tồn tại" | `maDichVu` không có trong DB | Return 400 Bad Request |
| "Phòng không tồn tại" | `maPhong` không có trong DB | Return 400 Bad Request |

### 💡 Lưu ý quan trọng

1. **Có thể gọi nhiều lần:** API này không hạn chế số lần gọi
2. **Mặc định ngày:** Nếu không gửi `ngaySuDung`, hệ thống dùng ngày hiện tại
3. **Mặc định giá:** Phải gửi `donGia` từ client (không lấy từ bảng Dichvu)
4. **Transaction:** Nếu lỗi, tự động rollback

---

## 🔹 LUỒNG 2: GHI NHẬN KIỂM KÊ PHÒNG

### 📖 Mô tả
Ghi nhận tình trạng phòng khi khách chuẩn bị rời đi:
- Kiểm tra phòng có hỏng gì không
- Ghi nhận mất chìa khóa, remote, v.v.
- Tính tiền bồi thường nếu có

**Điểm quan trọng:** Thường gọi API này **1 lần** vào lúc check-out, ngay trước API Check-out.

### 🔄 Quy trình chi tiết

```
┌─────────────────────────────────────────┐
│  INPUT: KiemkephongRequest              │
├─────────────────────────────────────────┤
│ {                                       │
│   "maPhieuThue": 1,        // ID phiếu │
│   "maPhong": 101,          // ID phòng │
│   "maNhanVien": 1,         // ID NV    │
│   "tinhTrang": "Phòng bình thường", │
│   "tienBoiThuong": 0,   // Tiền phạt  │
│   "ghiChu": "OK"        // Ghi chú    │
│ }                                       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 1: VALIDATE DỮ LIỆU ĐẦU VÀO    │
└─────────────────────────────────────────┘
            │
    ┌───────┴───────┬───────────────────┐
    ▼               ▼                   ▼
  Phiếu         Phòng               Nhân viên
  tồn tại?      tồn tại?            tồn tại?
    │               │                   │
    ❌              ❌                   ❌ → LỖI
    │               │                   │
    ✅              ✅                   ✅
    │               │                   │
    └───────┬───────┴───────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 2: TẠO BẢN GHI KIEMKEPHONG     │
├─────────────────────────────────────────┤
│ Kiemkephong {                           │
│   id: auto,                             │
│   maPhieuThue: 1,                       │
│   maPhong: 101,                         │
│   maNhanVien: 1,                        │
│   ngayKiemKe: 2026-05-31 // Mặc định │
│   tinhTrang: "Phòng bình thường",      │
│   tienBoiThuong: 0,    // Mặc định 0  │
│   ghiChu: "OK"                         │
│ }                                       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 3: LƯU VÀO DATABASE             │
│  Repository.save(Kiemkephong)          │
│  ✅ Lưu thành công                     │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  OUTPUT: KiemkephongResponse            │
├─────────────────────────────────────────┤
│ {                                       │
│   "id": 1,             // ID sinh ra   │
│   "maPhieuThue": 1,                    │
│   "maPhong": 101,                      │
│   "maNhanVien": 1,                     │
│   "ngayKiemKe": "2026-05-31",         │
│   "tinhTrang": "Phòng bình thường",   │
│   "tienBoiThuong": 0,  // Tiền phạt  │
│   "ghiChu": "OK",                     │
│   "message": "Ghi nhận kiểm kê phòng  │
│               thành công"              │
│ }                                       │
└─────────────────────────────────────────┘
```

### 📊 Ảnh hưởng đến Database

| Bảng | Hành động | Chi tiết |
|------|-----------|---------|
| **Kiemkephong** | INSERT | Thêm 1 bản ghi |
| **Phong** | SELECT | Kiểm tra tồn tại |
| **Nhanvien** | SELECT | Kiểm tra tồn tại |
| **Phieuthuephong** | SELECT | Kiểm tra tồn tại |

### ⚠️ Trường hợp lỗi

| Lỗi | Nguyên nhân | Xử lý |
|-----|-----------|-------|
| "Phiếu thuê phòng không tồn tại" | `maPhieuThue` không có trong DB | Return 400 Bad Request |
| "Phòng không tồn tại" | `maPhong` không có trong DB | Return 400 Bad Request |
| "Nhân viên không tồn tại" | `maNhanVien` không có trong DB | Return 400 Bad Request |

### 💡 Lưu ý quan trọng

1. **Mặc định ngày:** Nếu không gửi `ngayKiemKe`, hệ thống dùng ngày hiện tại
2. **Mặc định tiền bồi thường:** Nếu không gửi, mặc định = 0
3. **Mục đích:** Chuẩn bị dữ liệu để tính tiền phạt trong API Check-out
4. **Tồn tại nhiều kiểm kê:** 1 phiếu thuê có thể có nhiều bản ghi kiểm kê (nếu gọi API nhiều lần)

---

## 🔹 LUỒNG 3: CHECK-OUT (CỐT LÕI)

### 📖 Mô tả
**Luồng quan trọng nhất:** Gom tiền từ 3 nguồn → Tính tổng tiền → Xuất Hóa đơn

**3 nguồn tiền:**
1. **Tiền phòng** (từ CtPhieuthuephong)
2. **Tiền dịch vụ** (từ Sudungdichvu - tất cả những dịch vụ đã ghi nhận)
3. **Tiền phạt** (từ Kiemkephong - tất cả những bồi thường đã ghi nhận)

**Công thức:** `TỔNG TIỀN = TIỀN PHÒNG + TIỀN DỊCH VỤ + TIỀN PHẠT`

### 🔄 Quy trình chi tiết

```
┌─────────────────────────────────────────┐
│  INPUT: CheckoutRequest                 │
├─────────────────────────────────────────┤
│ {                                       │
│   "maPhieuThue": 1,    // ID phiếu     │
│   "maNhanVien": 1      // ID NV check-out
│ }                                       │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 1: VALIDATE DỮ LIỆU ĐẦU VÀO    │
└─────────────────────────────────────────┘
            │
      ┌─────┴─────┐
      ▼           ▼
   Phiếu      Nhân viên
   tồn tại?   tồn tại?
      │           │
      ❌          ❌ → LỖI
      │           │
      ✅          ✅
      │           │
      └─────┬─────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 2: TÍNH TIỀN PHÒNG (P)          │
├─────────────────────────────────────────┤
│  Query: CtPhieuthuephong                │
│  WHERE maPhieuThue = 1                  │
│                                         │
│  Kết quả:                               │
│  - Phòng 101: 1,000,000                │
│  - Phòng 102: 500,000                  │
│  P = SUM(donGia) = 1,500,000           │
│                                         │
│  ✅ SQL: SELECT SUM(donGia)            │
│           FROM CtPhieuthuephong        │
│           WHERE maPhieuThue = 1        │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 3: TÍNH TIỀN DỊCH VỤ (D)        │
├─────────────────────────────────────────┤
│  Query: Sudungdichvu                    │
│  WHERE maPhieuThue = 1                  │
│                                         │
│  Kết quả:                               │
│  - Cơm chiên (2 × 75,000) = 150,000   │
│  - Giặt ủi (1 × 50,000) = 50,000      │
│  D = 150,000 + 50,000 = 200,000        │
│                                         │
│  ✅ SQL: SELECT SUM(thanhTien)         │
│           FROM Sudungdichvu            │
│           WHERE maPhieuThue = 1        │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 4: TÍNH TIỀN PHẠT (F)           │
├─────────────────────────────────────────┤
│  Query: Kiemkephong                     │
│  WHERE maPhieuThue = 1                  │
│                                         │
│  Kết quả:                               │
│  - Mất chìa khóa: 100,000              │
│  - TV hỏng: 500,000                    │
│  F = 100,000 + 500,000 = 600,000       │
│                                         │
│  ✅ SQL: SELECT SUM(tienBoiThuong)    │
│           FROM Kiemkephong             │
│           WHERE maPhieuThue = 1        │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 5: TÍNH TỔNG TIỀN                │
├─────────────────────────────────────────┤
│  TỔNG = P + D + F                      │
│  TỔNG = 1,500,000 + 200,000 + 600,000 │
│  TỔNG = 2,300,000                      │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 6: TẠO HÓA ĐƠN (HOADON)         │
├─────────────────────────────────────────┤
│  Hoadon {                               │
│    id: auto,            // Auto gen    │
│    maPhieuThue: 1,                     │
│    maNhanVien: 1,                      │
│    ngayThanhToan: 2026-05-31 (hôm nay) │
│    tongTien: 2,300,000                 │
│  }                                      │
│                                         │
│  ✅ INSERT INTO Hoadon ...             │
│  → Sinh ra maHoaDon = 1                │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  BƯỚC 7: TẠO CHI TIẾT HÓA ĐƠN        │
│           (CTHOADON)                    │
├─────────────────────────────────────────┤
│                                         │
│  7.1. Chi tiết TIỀN PHÒNG:             │
│  ─────────────────────────────         │
│  SELECT * FROM CtPhieuthuephong        │
│  WHERE maPhieuThue = 1                 │
│                                         │
│  Duyệt từng phòng:                     │
│  ├─ Phòng 101 → INSERT CtHoadon       │
│  │   loaiChiPhi: "Tiền phòng"         │
│  │   donGia: 1,000,000                 │
│  │   thanhTien: 1,000,000              │
│  │   → CtHoadon.id = 1                 │
│  │                                     │
│  └─ Phòng 102 → INSERT CtHoadon       │
│      loaiChiPhi: "Tiền phòng"         │
│      donGia: 500,000                   │
│      thanhTien: 500,000                │
│      → CtHoadon.id = 2                 │
│                                         │
│  7.2. Chi tiết DỊCH VỤ:               │
│  ─────────────────────────────         │
│  SELECT * FROM Sudungdichvu            │
│  WHERE maPhieuThue = 1                 │
│                                         │
│  Duyệt từng dịch vụ:                   │
│  ├─ Cơm chiên → INSERT CtHoadon       │
│  │   loaiChiPhi: "Dịch vụ"            │
│  │   soLuong: 2                        │
│  │   donGia: 75,000                    │
│  │   thanhTien: 150,000                │
│  │   → CtHoadon.id = 3                 │
│  │                                     │
│  └─ Giặt ủi → INSERT CtHoadon         │
│      loaiChiPhi: "Dịch vụ"            │
│      soLuong: 1                        │
│      donGia: 50,000                    │
│      thanhTien: 50,000                 │
│      → CtHoadon.id = 4                 │
│                                         │
│  7.3. Chi tiết TIỀN PHẠT:              │
│  ─────────────────────────────         │
│  SELECT * FROM Kiemkephong             │
│  WHERE maPhieuThue = 1                 │
│                                         │
│  Duyệt từng bản ghi (chỉ nếu phạt > 0):
│  ├─ Mất chìa → INSERT CtHoadon        │
│  │   loaiChiPhi: "Tiền phạt/Bồi thường"
│  │   donGia: 100,000                   │
│  │   thanhTien: 100,000                │
│  │   → CtHoadon.id = 5                 │
│  │                                     │
│  └─ TV hỏng → INSERT CtHoadon         │
│      loaiChiPhi: "Tiền phạt/Bồi thường"
│      donGia: 500,000                   │
│      thanhTien: 500,000                │
│      → CtHoadon.id = 6                 │
│                                         │
│  ✅ Total: 6 bản ghi CtHoadon         │
└─────────────────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│  OUTPUT: CheckoutResponse               │
├─────────────────────────────────────────┤
│ {                                       │
│   "maHoaDon": 1,                       │
│   "maPhieuThue": 1,                    │
│   "maNhanVien": 1,                     │
│   "ngayThanhToan": "2026-05-31",       │
│   "tienPhong": 1500000,                │
│   "tienDichVu": 200000,                │
│   "tienPhat": 600000,                  │
│   "tongTien": 2300000,                 │
│   "chiTietHoaDon": [                   │
│     {                                   │
│       "id": 1,                         │
│       "loaiChiPhi": "Tiền phòng",     │
│       "soLuong": 1,                    │
│       "donGia": 1000000,               │
│       "thanhTien": 1000000             │
│     },                                  │
│     {                                   │
│       "id": 2,                         │
│       "loaiChiPhi": "Tiền phòng",     │
│       "soLuong": 1,                    │
│       "donGia": 500000,                │
│       "thanhTien": 500000              │
│     },                                  │
│     {                                   │
│       "id": 3,                         │
│       "loaiChiPhi": "Dịch vụ",        │
│       "soLuong": 2,                    │
│       "donGia": 75000,                 │
│       "thanhTien": 150000              │
│     },                                  │
│     {                                   │
│       "id": 4,                         │
│       "loaiChiPhi": "Dịch vụ",        │
│       "soLuong": 1,                    │
│       "donGia": 50000,                 │
│       "thanhTien": 50000               │
│     },                                  │
│     {                                   │
│       "id": 5,                         │
│       "loaiChiPhi": "Tiền phạt/Bồi    │
│                     thương",           │
│       "soLuong": 1,                    │
│       "donGia": 100000,                │
│       "thanhTien": 100000              │
│     },                                  │
│     {                                   │
│       "id": 6,                         │
│       "loaiChiPhi": "Tiền phạt/Bồi    │
│                     thương",           │
│       "soLuong": 1,                    │
│       "donGia": 500000,                │
│       "thanhTien": 500000              │
│     }                                   │
│   ],                                    │
│   "message": "Check-out thành công.    │
│               Hóa đơn đã được xuất"    │
│ }                                       │
└─────────────────────────────────────────┘
```

### 📊 Ảnh hưởng đến Database

| Bảng | Hành động | Chi tiết |
|------|-----------|---------|
| **CtPhieuthuephong** | SELECT | Lấy tất cả dòng |
| **Sudungdichvu** | SELECT | Lấy tất cả dòng |
| **Kiemkephong** | SELECT | Lấy tất cả dòng |
| **Hoadon** | INSERT | Thêm 1 hóa đơn |
| **CtHoadon** | INSERT | Thêm 3-7 chi tiết |

### ⚠️ Trường hợp lỗi

| Lỗi | Nguyên nhân | Xử lý |
|-----|-----------|-------|
| "Phiếu thuê phòng không tồn tại" | `maPhieuThue` không có | Return 400 Bad Request |
| "Nhân viên không tồn tại" | `maNhanVien` không có | Return 400 Bad Request |
| Tiền phòng = 0 | Không có chi tiết phòng | Vẫn tiếp tục, có thể = 0 |

### 💡 Lưu ý quan trọng

1. **Transactional:** Toàn bộ quá trình là 1 transaction (nếu lỗi, rollback hết)
2. **Không xóa dữ liệu:** Chỉ tạo Hoadon + CtHoadon, không xóa dữ liệu cũ
3. **Có thể gọi lại:** Nếu gọi lại cùng phiếu thuê, sẽ tạo hóa đơn mới (không kiểm tra trùng)
4. **Tính toán động:** Tiền được tính từ các bảng hiện tại, không lưu tĩnh
5. **Độ ưu tiên:** Tiền phòng > Tiền dịch vụ > Tiền phạt (trong hiển thị)

---

## 🔄 TƯƠNG TÁC GIỮA 3 LUỒNG

### Trình tự gọi API

```
Khách ở tại phòng
    ↓
    ├─→ API 1: add-service (gọi nhiều lần)
    │   └─ Ghi nhận dịch vụ: đồ ăn, giặt ủi...
    │   └ Lưu vào Sudungdichvu
    │
    ├─→ API 1: add-service (gọi lần 2)
    │   └ Ghi nhận dịch vụ khác
    │   └ Lưu vào Sudungdichvu
    │
    ├─→ API 2: record-inspection (gọi 1 lần)
    │   └ Kiểm tra phòng khi khách chuẩn bị trả
    │   └ Nếu hỏng, ghi nhận tiền phạt
    │   └ Lưu vào Kiemkephong
    │
    └─→ API 3: checkout (gọi 1 lần cuối)
        ├ Lấy dữ liệu từ 3 bảng
        │  ├ CtPhieuthuephong (tiền phòng)
        │  ├ Sudungdichvu (tiền dịch vụ)
        │  └ Kiemkephong (tiền phạt)
        │
        ├ Tính tổng
        │ TỔNG = P + D + F
        │
        ├ Tạo Hoadon
        │
        └ Tạo CtHoadon (chi tiết)
           └ Lưu vào Hoadon & CtHoadon

Khách rời đi - Thanh toán xong
```

### Mối quan hệ dữ liệu

```
Phieuthuephong (1)
    ├─→ (1:N) CtPhieuthuephong (Tiền phòng)
    │   └─→ (1:N) CtHoadon (Chi tiết hóa đơn)
    │
    ├─→ (1:N) Sudungdichvu (Tiền dịch vụ)
    │   └─→ (1:N) CtHoadon (Chi tiết hóa đơn)
    │
    ├─→ (1:N) Kiemkephong (Tiền phạt)
    │   └─→ (1:N) CtHoadon (Chi tiết hóa đơn)
    │
    └─→ (1:N) Hoadon (Hóa đơn)
        └─→ (1:N) CtHoadon (Chi tiết hóa đơn)
```

---

## 📋 BẢNG TÓM TẮT

| API | URL | Method | Mục đích | Gọi bao nhiêu lần | Khi nào gọi |
|-----|-----|--------|---------|------------------|------------|
| **Thêm Dịch vụ** | `/api/billing/add-service` | POST | Ghi nhận dịch vụ | Nhiều lần | Trong quá trình ở |
| **Ghi nhận Kiểm kê** | `/api/billing/record-inspection` | POST | Kiểm tra phòng khi trả | 1 lần | Trước check-out |
| **Check-out** | `/api/billing/checkout` | POST | Tính tổng tiền & xuất hóa đơn | 1 lần | Cuối cùng khi khách trả phòng |

---

## 🔍 CHI TIẾT TECHNICAL

### Transaction & ACID

- **Tất cả API đều dùng `@Transactional`**
- Nếu lỗi ở bất kỳ bước nào, tự động rollback
- Đảm bảo dữ liệu nhất quán

### Error Handling

- Validate dữ liệu đầu vào trước
- Try-catch bắt tất cả exception
- Trả về response với `message` mô tả lỗi

### Response Status

| Status | Nguyên nhân |
|--------|-----------|
| 200 OK | Thành công |
| 400 Bad Request | Dữ liệu không hợp lệ hoặc không tồn tại |
| 500 Internal Server Error | Lỗi server (bất ngờ) |

---

## 🎯 Ví dụ thực tế

### Scenario: Khách ở phòng 101 trong 2 ngày

**Ngày 1:**
```bash
# 14:00 - Khách gọi đồ ăn
POST /api/billing/add-service
{
  "maPhieuThue": 1,
  "maDichVu": 5,  // Cơm chiên
  "maPhong": 101,
  "soLuong": 2,
  "donGia": 75000
}
→ Thanhti = 150,000 (vào Sudungdichvu)

# 18:00 - Khách gọi dịch vụ giặt ủi
POST /api/billing/add-service
{
  "maPhieuThue": 1,
  "maDichVu": 3,  // Giặt ủi
  "maPhong": 101,
  "soLuong": 1,
  "donGia": 50000
}
→ Thanhtien = 50,000 (vào Sudungdichvu)
```

**Ngày 2 (Trả phòng):**
```bash
# 10:00 - Nhân viên kiểm kê phòng (TV hỏng)
POST /api/billing/record-inspection
{
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 1,
  "tinhTrang": "TV bị hỏng",
  "tienBoiThuong": 500000
}
→ Lưu vào Kiemkephong

# 10:05 - Check-out
POST /api/billing/checkout
{
  "maPhieuThue": 1,
  "maNhanVien": 1
}
→ Response:
{
  "maHoaDon": 1,
  "tienPhong": 1000000,     // Từ CtPhieuthuephong
  "tienDichVu": 200000,     // 150,000 + 50,000
  "tienPhat": 500000,       // Từ Kiemkephong
  "tongTien": 1700000,      // 1000000 + 200000 + 500000
  "chiTietHoaDon": [
    { "loaiChiPhi": "Tiền phòng", "thanhTien": 1000000 },
    { "loaiChiPhi": "Dịch vụ", "thanhTien": 150000 },
    { "loaiChiPhi": "Dịch vụ", "thanhTien": 50000 },
    { "loaiChiPhi": "Tiền phạt/Bồi thương", "thanhTien": 500000 }
  ]
}
```

---

## 📚 Tệp liên quan

- `BillingController.java` - Controller (3 API endpoints)
- `BillingService.java` - Service (3 logic methods)
- `SudungdichvuRepository.java` - Query dịch vụ
- `KiemkephongRepository.java` - Query kiểm kê
- `HoadonRepository.java` - Query hóa đơn
- `CtHoadonRepository.java` - Query chi tiết hóa đơn
- `CtPhieuthuephongRepository.java` - Query tiền phòng
- DTOs: `*Request.java` & `*Response.java`

---

**Cập nhật:** 31-05-2026  
**Phiên bản:** 1.0
