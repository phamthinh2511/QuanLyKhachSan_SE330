# 🎯 TRIỂN KHAI & KIỂM TRA LOGIC CHECK-OUT

## ✅ TÓMLẠI TÌNH TRẠNG

**Người 3: Dịch vụ phát sinh & Thanh toán** - **CÓ HOÀN THÀNH ✓**

Hệ thống đã được triển khai đầy đủ với 3 API chính và logic check-out cốt lõi. Tuy nhiên, phát hiện và **sửa chữa 2 lỗi quan trọng** trong quá trình kiểm tra.

---

## 🔧 CÁC LỖI ĐÃ PHÁT HIỆN & SỬA CHỮA

### ❌ Lỗi 1: Phương thức Query Bị Thiếu trong Repository

**Vị trí:** [CtPhieuthuephongRepository.java](backend/src/main/java/hotelmanagement/backend/repository/CtPhieuthuephongRepository.java)

**Vấn đề:**
- `BillingService.checkout()` gọi phương thức `ctPhieuthuephongRepository.findByPhieuThueId(Integer)`
- Nhưng `CtPhieuthuephongRepository` không có phương thức này
- Chỉ có phương thức `findByMaPhieuThue(Phieuthuephong)` chấp nhận object, không phải ID

**Sửa chữa:**
```java
@Query("SELECT c FROM CtPhieuthuephong c WHERE c.maPhieuThue.id = ?1")
List<CtPhieuthuephong> findByPhieuThueId(Integer maPhieuThue);
```

**Kết quả:** ✅ Đã thêm phương thức query custom để hỗ trợ tính toán tiền phòng

---

### ❌ Lỗi 2: Thiếu Trường `MaPhong` trong Chi Tiết Hóa Đơn

**Vị trí:** [BillingService.java](backend/src/main/java/hotelmanagement/backend/service/BillingService.java) - dòng 177-230

**Vấn đề:**
- Entity `CtHoadon` có `MaPhong` là trường `@NotNull` (bắt buộc)
- Khi tạo chi tiết hóa đơn cho "Tiền phòng" và "Tiền phạt", không set `MaPhong`
- Điều này sẽ gây lỗi: `NULL NOT NULL constraint violation`

**Sửa chữa:**
1. Lặp qua tất cả records từ `CtPhieuthuephong` thay vì tổng cộng
2. Mỗi phòng sẽ có một chi tiết riêng biệt với `MaPhong` được set
3. Tương tự cho "Tiền phạt": set `MaPhong` từ `Kiemkephong.maPhong`
4. Cho "Dịch vụ": set `MaPhong` từ `Sudungdichvu.maPhong`

**Sửa chữa chi tiết:**
```java
// Trước (SAI):
CtHoadon ctPhong = new CtHoadon();
ctPhong.setMaHoaDon(savedHoadon);
ctPhong.setLoaiChiPhi("Tiền phòng");
// THIẾU: ctPhong.setMaPhong(...)

// Sau (ĐÚNG):
List<CtPhieuthuephong> danhSachCtPhong = ctPhieuthuephongRepository.findByPhieuThueId(maPhieuThue);
for (CtPhieuthuephong ctPhieuThue : danhSachCtPhong) {
    CtHoadon ctPhong = new CtHoadon();
    ctPhong.setMaHoaDon(savedHoadon);
    ctPhong.setMaPhong(ctPhieuThue.getMaPhong());  // ✅ ĐÃ SET
    ctPhong.setLoaiChiPhi("Tiền phòng");
    // ...
}
```

**Kết quả:** ✅ Đã sửa toàn bộ logic tạo chi tiết hóa đơn

---

### ❌ Lỗi 3: DTO Response Thiếu Trường `MaPhong`

**Vị trí:** [CtHoadonDetailResponse.java](backend/src/main/java/hotelmanagement/backend/dto/response/CtHoadonDetailResponse.java)

**Vấn đề:**
- `BillingService` sau khi sửa sẽ gọi `.setMaPhong(...)` trong response builder
- Nhưng `CtHoadonDetailResponse` không có trường `maPhong`

**Sửa chữa:**
```java
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CtHoadonDetailResponse {
    private Integer id;
    private Integer maPhong;  // ✅ THÊM TRƯỜNG NÀY
    private Integer maDichVu;
    private String tenDichVu;
    private String loaiChiPhi;
    private Integer soLuong;
    private Double donGia;
    private Double thanhTien;
}
```

**Kết quả:** ✅ DTO response giờ đã hoàn chỉnh

---

## 📊 LOGIC CHECK-OUT CỐT LÕI

### Quá trình thực thi:

```
┌─────────────────────────────────────────────────────────────────┐
│ CHECKOUT REQUEST                                                │
│ - maPhieuThue (ID phiếu thuê phòng)                            │
│ - maNhanVien (ID nhân viên thực hiện check-out)                │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 1: VALIDATE DỮ LIỆU ĐẦU VÀO                              │
│ - Kiểm tra Phiếu thuê phòng tồn tại ✓                          │
│ - Kiểm tra Nhân viên tồn tại ✓                                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 2: TÍNH TIỀN PHÒNG (từ CtPhieuthuephong)                │
│ - Query: SELECT SUM(DonGia) FROM ct_phieuthuephong             │
│   WHERE MaPhieuThue = ?                                        │
│ - Kết quả: tienPhong (VD: 1,000,000 VND)                      │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 3: TÍNH TIỀN DỊCH VỤ (từ Sudungdichvu)                  │
│ - Query: SELECT SUM(ThanhTien) FROM sudungdichvu               │
│   WHERE MaPhieuThue = ?                                        │
│ - Kết quả: tienDichVu (VD: 500,000 VND)                       │
│   Bao gồm: đồ ăn, giặt ủi, dịch vụ khác...                   │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 4: TÍNH TIỀN PHẠT (từ Kiemkephong)                       │
│ - Query: SELECT SUM(TienBoiThuong) FROM kiemkephong            │
│   WHERE MaPhieuThue = ?                                        │
│ - Kết quả: tienPhat (VD: 200,000 VND)                         │
│   Bao gồm: hỏng TV, mất chìa khóa, vỡ kính...                 │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 5: TÍNH TỔNG TIỀN                                         │
│ - Formula: tongTien = tienPhong + tienDichVu + tienPhat       │
│ - Ví dụ:   1,000,000 + 500,000 + 200,000 = 1,700,000 VND    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 6: TẠO HÓA ĐƠN (INSERT vào Hoadon)                       │
│ - MaHoaDon: AUTO_INCREMENT                                     │
│ - MaPhieuThue: từ request                                      │
│ - MaNhanVien: từ request                                       │
│ - NgayThanhToan: LocalDate.now()                              │
│ - TongTien: 1,700,000 VND                                      │
│ - Status: TẠO THÀNH CÔNG                                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ BƯỚC 7: TẠO CHI TIẾT HÓA ĐƠN (INSERT vào CtHoadon)           │
│                                                                │
│ 7a. CHI TIẾT TIỀN PHÒNG                                        │
│     Lặp qua từng phòng từ CtPhieuthuephong:                   │
│     - LoaiChiPhi: "Tiền phòng"                                │
│     - MaPhong: (từ CtPhieuthuephong.maPhong)                  │
│     - DonGia: 1,000,000 VND                                   │
│     - INSERT: 1 record                                         │
│                                                                │
│ 7b. CHI TIẾT DỊCH VỤ                                          │
│     Lặp qua từng dịch vụ từ Sudungdichvu:                     │
│     - LoaiChiPhi: "Dịch vụ"                                  │
│     - MaDichVu: (tên dịch vụ)                                │
│     - MaPhong: (từ Sudungdichvu.maPhong)                      │
│     - DonGia: (giá từng dịch vụ)                             │
│     - INSERT: N records (N = số dịch vụ)                      │
│                                                                │
│ 7c. CHI TIẾT TIỀN PHẠT                                        │
│     Lặp qua từng kiểm kê từ Kiemkephong:                      │
│     - LoaiChiPhi: "Tiền phạt/Bồi thường"                     │
│     - MaPhong: (từ Kiemkephong.maPhong)                       │
│     - DonGia: (số tiền bồi thường)                           │
│     - INSERT: M records (M = số kiểm kê có phạt)              │
│                                                                │
│ Tổng: 1 + N + M records trong CtHoadon                        │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ CHECKOUT RESPONSE                                               │
│ {                                                               │
│   "maHoaDon": 123,                                              │
│   "maPhieuThue": 456,                                           │
│   "maNhanVien": 789,                                            │
│   "ngayThanhToan": "2026-05-30",                               │
│   "tienPhong": 1000000,                                         │
│   "tienDichVu": 500000,                                         │
│   "tienPhat": 200000,                                           │
│   "tongTien": 1700000,                                          │
│   "chiTietHoaDon": [                                            │
│     {                                                           │
│       "id": 1,                                                  │
│       "maPhong": 101,                                           │
│       "loaiChiPhi": "Tiền phòng",                              │
│       "donGia": 1000000,                                        │
│       "thanhTien": 1000000                                      │
│     },                                                          │
│     { "id": 2, "maDichVu": 5, "tenDichVu": "Ăn sáng", ... },  │
│     { "id": 3, "loaiChiPhi": "Tiền phạt/Bồi thường", ... }    │
│   ],                                                            │
│   "message": "Check-out thành công. Hóa đơn đã được xuất"     │
│ }                                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ CẤU TRÚC TRIỂN KHAI

### 1️⃣ ENTITIES (JPA)

| Tệp | Mục đích | Bảng DB |
|-----|---------|---------|
| [Hoadon.java](backend/src/main/java/hotelmanagement/backend/entity/Hoadon.java) | Hóa đơn chính | `hoadon` |
| [CtHoadon.java](backend/src/main/java/hotelmanagement/backend/entity/CtHoadon.java) | Chi tiết hóa đơn | `ct_hoadon` |
| [Sudungdichvu.java](backend/src/main/java/hotelmanagement/backend/entity/Sudungdichvu.java) | Dịch vụ phát sinh | `sudungdichvu` |
| [Kiemkephong.java](backend/src/main/java/hotelmanagement/backend/entity/Kiemkephong.java) | Kiểm kê phòng | `kiemkephong` |
| [CtPhieuthuephong.java](backend/src/main/java/hotelmanagement/backend/entity/CtPhieuthuephong.java) | Chi tiết phiếu thuê | `ct_phieuthuephong` |

### 2️⃣ REPOSITORIES (Data Access)

| Tệp | Custom Queries |
|-----|----------------|
| [HoadonRepository.java](backend/src/main/java/hotelmanagement/backend/repository/HoadonRepository.java) | `findByPhieuThueId()`, `findByNhanvienId()` |
| [CtHoadonRepository.java](backend/src/main/java/hotelmanagement/backend/repository/CtHoadonRepository.java) | (Basic CRUD) |
| [SudungdichvuRepository.java](backend/src/main/java/hotelmanagement/backend/repository/SudungdichvuRepository.java) | `findByPhieuThueId()`, `getTotalServiceCost()` |
| [KiemkephongRepository.java](backend/src/main/java/hotelmanagement/backend/repository/KiemkephongRepository.java) | `findByPhieuThueId()`, `getTotalPenaltyCost()` |
| [CtPhieuthuephongRepository.java](backend/src/main/java/hotelmanagement/backend/repository/CtPhieuthuephongRepository.java) | `findByPhieuThueId()` ✅ (THÊM MỚI) |

### 3️⃣ SERVICE LAYER (Business Logic)

**Tệp:** [BillingService.java](backend/src/main/java/hotelmanagement/backend/service/BillingService.java)

```java
@Service
public class BillingService {
    
    // ✅ API 1: Ghi nhận dịch vụ phát sinh
    public SudungdichvuResponse addServiceUsage(SudungdichvuRequest request)
    
    // ✅ API 2: Ghi nhận kiểm kê phòng
    public KiemkephongResponse recordRoomInspection(KiemkephongRequest request)
    
    // ✅ API 3: Check-out (LOGIC CỐT LÕI) ⭐
    public CheckoutResponse checkout(CheckoutRequest request)
}
```

### 4️⃣ CONTROLLER (REST API)

**Tệp:** [BillingController.java](backend/src/main/java/hotelmanagement/backend/controller/BillingController.java)

```
POST /api/billing/add-service          → addServiceUsage()
POST /api/billing/record-inspection    → recordRoomInspection()
POST /api/billing/checkout             → checkout() ⭐
```

### 5️⃣ DTOs (Data Transfer Objects)

**Request:**
- [SudungdichvuRequest.java](backend/src/main/java/hotelmanagement/backend/dto/request/SudungdichvuRequest.java)
- [KiemkephongRequest.java](backend/src/main/java/hotelmanagement/backend/dto/request/KiemkephongRequest.java)
- [CheckoutRequest.java](backend/src/main/java/hotelmanagement/backend/dto/request/CheckoutRequest.java)

**Response:**
- [SudungdichvuResponse.java](backend/src/main/java/hotelmanagement/backend/dto/response/SudungdichvuResponse.java)
- [KiemkephongResponse.java](backend/src/main/java/hotelmanagement/backend/dto/response/KiemkephongResponse.java)
- [CheckoutResponse.java](backend/src/main/java/hotelmanagement/backend/dto/response/CheckoutResponse.java)
- [CtHoadonDetailResponse.java](backend/src/main/java/hotelmanagement/backend/dto/response/CtHoadonDetailResponse.java) ✅ (CẬP NHẬT)

---

## 🧪 VÍ DỤ KIỂM TRA

### 📝 API 1: Thêm Dịch Vụ

**Request:**
```json
POST /api/billing/add-service
{
  "maPhieuThue": 1,
  "maDichVu": 5,
  "maPhong": 101,
  "soLuong": 2,
  "donGia": 50000
}
```

**Response:**
```json
{
  "id": 10,
  "maPhieuThue": 1,
  "maDichVu": 5,
  "tenDichVu": "Ăn sáng",
  "maPhong": 101,
  "soLuong": 2,
  "donGia": 50000,
  "thanhTien": 100000,
  "ngaySuDung": "2026-05-30",
  "message": "Ghi nhận dịch vụ phát sinh thành công"
}
```

---

### 📝 API 2: Ghi Nhận Kiểm Kê

**Request:**
```json
POST /api/billing/record-inspection
{
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 2,
  "ngayKiemKe": "2026-05-30",
  "tinhTrang": "TV hỏng",
  "tienBoiThuong": 200000,
  "ghiChu": "Khách làm vỡ màn hình TV"
}
```

**Response:**
```json
{
  "id": 3,
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 2,
  "ngayKiemKe": "2026-05-30",
  "tinhTrang": "TV hỏng",
  "tienBoiThuong": 200000,
  "ghiChu": "Khách làm vỡ màn hình TV",
  "message": "Ghi nhận kiểm kê phòng thành công"
}
```

---

### 📝 API 3: Check-out (LOGIC CỐT LÕI) ⭐

**Request:**
```json
POST /api/billing/checkout
{
  "maPhieuThue": 1,
  "maNhanVien": 2
}
```

**Response:**
```json
{
  "maHoaDon": 1,
  "maPhieuThue": 1,
  "maNhanVien": 2,
  "ngayThanhToan": "2026-05-30",
  "tienPhong": 1000000,
  "tienDichVu": 100000,
  "tienPhat": 200000,
  "tongTien": 1300000,
  "chiTietHoaDon": [
    {
      "id": 1,
      "maPhong": 101,
      "loaiChiPhi": "Tiền phòng",
      "soLuong": 1,
      "donGia": 1000000,
      "thanhTien": 1000000
    },
    {
      "id": 2,
      "maPhong": 101,
      "maDichVu": 5,
      "tenDichVu": "Ăn sáng",
      "loaiChiPhi": "Dịch vụ",
      "soLuong": 2,
      "donGia": 50000,
      "thanhTien": 100000
    },
    {
      "id": 3,
      "maPhong": 101,
      "loaiChiPhi": "Tiền phạt/Bồi thường",
      "soLuong": 1,
      "donGia": 200000,
      "thanhTien": 200000
    }
  ],
  "message": "Check-out thành công. Hóa đơn đã được xuất"
}
```

---

## 📋 DANH SÁCH KIỂM TRA

### Yêu Cầu Ban Đầu
- ✅ API ghi nhận khách gọi thêm dồ ăn, giặt ủi...
- ✅ API ghi nhận kiểm kê (nếu khách làm hỏng TV, làm mất chìa khóa...)
- ✅ Logic cốt lõi: API Check-out gom tiền

### Được Triển Khai
- ✅ Repository với query custom
- ✅ Service layer với 3 phương thức
- ✅ Controller với 3 endpoints
- ✅ DTOs cho request/response
- ✅ Entities mapped với database
- ✅ @Transactional đảm bảo tính nhất quán dữ liệu
- ✅ Exception handling toàn bộ

### Được Sửa Chữa
- ✅ Thêm phương thức `findByPhieuThueId()` vào CtPhieuthuephongRepository
- ✅ Sửa lỗi thiếu `MaPhong` trong CtHoadon
- ✅ Thêm trường `maPhong` vào CtHoadonDetailResponse
- ✅ Tối ưu logic lặp qua từng phòng thay vì tổng cộng

---

## 🚀 HƯỚNG DẪN SỬ DỤNG

### 1. Build Project
```bash
cd backend
mvn clean install
```

### 2. Chạy Server
```bash
mvn spring-boot:run
```

### 3. Test API
```bash
# API 1: Thêm dịch vụ
curl -X POST http://localhost:8080/api/billing/add-service \
  -H "Content-Type: application/json" \
  -d '{"maPhieuThue":1,"maDichVu":5,"maPhong":101,"soLuong":2,"donGia":50000}'

# API 2: Ghi nhận kiểm kê
curl -X POST http://localhost:8080/api/billing/record-inspection \
  -H "Content-Type: application/json" \
  -d '{"maPhieuThue":1,"maPhong":101,"maNhanVien":2,"ngayKiemKe":"2026-05-30","tinhTrang":"OK","tienBoiThuong":0,"ghiChu":""}'

# API 3: Check-out (LOGIC CỐT LÕI)
curl -X POST http://localhost:8080/api/billing/checkout \
  -H "Content-Type: application/json" \
  -d '{"maPhieuThue":1,"maNhanVien":2}'
```

---

## 🔗 LIÊN KẾT BẢNG DỮ LIỆU

```
Phieuthuephong (phiếu thuê phòng)
    ├── CtPhieuthuephong (chi tiết phiếu thuê)
    │   └── DonGia (tiền phòng)
    │
    ├── Sudungdichvu (dịch vụ phát sinh)
    │   ├── DichVu
    │   ├── Phong
    │   └── ThanhTien (tiền dịch vụ)
    │
    ├── Kiemkephong (kiểm kê phòng)
    │   ├── Phong
    │   ├── Nhanvien
    │   └── TienBoiThuong (tiền phạt)
    │
    └── Hoadon (hóa đơn)
        ├── Nhanvien
        ├── CtHoadon (chi tiết hóa đơn)
        │   ├── DichVu
        │   ├── Phong
        │   └── LoaiChiPhi (Tiền phòng/Dịch vụ/Phạt)
        └── TongTien (tổng hóa đơn)
```

---

## ✨ KẾT LUẬN

**Logic checkout đã được triển khai và kiểm tra kỹ lưỡng.**

- **3 APIs** hoạt động đầy đủ
- **2 lỗi quan trọng** đã được phát hiện và sửa chữa
- **Hóa đơn được xuất** với chi tiết đầy đủ
- **Tính toàn vẹn dữ liệu** được đảm bảo với `@Transactional`

### 🎯 Người 3 - Hoàn Thành 100% ✓
