# ⚡ QUICK REFERENCE - NGƯỜI 3: DỊCH VỤ PHÁT SINH & THANH TOÁN

## 🎯 3 API CHÍNH

### 1️⃣ API Thêm Dịch vụ Phát sinh
```bash
POST /api/billing/add-service

Request:
{
  "maPhieuThue": 1,
  "maDichVu": 1,
  "maPhong": 101,
  "soLuong": 2,
  "donGia": 75000
}

Response:
{
  "id": 1,
  "thanhTien": 150000,  // Auto calculated: soLuong × donGia
  "message": "Ghi nhận dịch vụ phát sinh thành công"
}
```

### 2️⃣ API Ghi nhận Kiểm kê Phòng
```bash
POST /api/billing/record-inspection

Request:
{
  "maPhieuThue": 1,
  "maPhong": 101,
  "maNhanVien": 1,
  "tinhTrang": "Phòng bình thường",
  "tienBoiThuong": 0  // If damaged: amount to charge
}

Response:
{
  "id": 1,
  "message": "Ghi nhận kiểm kê phòng thành công"
}
```

### 3️⃣ API Check-out (⭐ CỐT LÕI)
```bash
POST /api/billing/checkout

Request:
{
  "maPhieuThue": 1,
  "maNhanVien": 1
}

Response:
{
  "maHoaDon": 1,
  "tienPhong": 1000000,      // From CtPhieuthuephong
  "tienDichVu": 150000,      // From Sudungdichvu (SUM)
  "tienPhat": 0,             // From Kiemkephong (SUM)
  "tongTien": 1150000,       // Total = P + D + F
  "chiTietHoaDon": [         // Invoice details
    { "loaiChiPhi": "Tiền phòng", "thanhTien": 1000000 },
    { "loaiChiPhi": "Dịch vụ", "thanhTien": 150000 }
  ],
  "message": "Check-out thành công"
}
```

---

## 📊 CÔNG THỨC TÍNH TOÁN

```
Tiền phòng (P)  = SUM(CtPhieuthuephong.donGia)
Tiền dịch vụ (D) = SUM(Sudungdichvu.soLuong × Sudungdichvu.donGia)
Tiền phạt (F)   = SUM(Kiemkephong.tienBoiThuong)

TỔNG TIỀN = P + D + F
```

**Ví dụ:**
- Phòng: 1,000,000
- Dịch vụ: 2 × 75,000 = 150,000
- Phạt: 0
- **Tổng: 1,150,000**

---

## 🗄️ 4 BẢNG DỮ LIỆU

| Bảng | Mục đích | Field chính |
|------|----------|------------|
| **Sudungdichvu** | Dịch vụ phát sinh | MaPhieuThue, MaDichVu, SoLuong, ThanhTien |
| **Kiemkephong** | Kiểm kê khi trả | MaPhieuThue, TinhTrang, TienBoiThuong |
| **Hoadon** | Hóa đơn | MaHoaDon, MaPhieuThue, TongTien |
| **CtHoadon** | Chi tiết hóa đơn | MaHoaDon, LoaiChiPhi, ThanhTien |

---

## 📁 KEY FILES

| File | Purpose |
|------|---------|
| `BillingController.java` | 3 API endpoints |
| `BillingService.java` | Core logic ⭐ |
| `SudungdichvuRepository.java` | Query service usage |
| `KiemkephongRepository.java` | Query inspections |
| `HoadonRepository.java` | Query invoices |
| `CtHoadonRepository.java` | Query invoice details |

---

## 🔄 DATA FLOW CHECK-OUT

```
Input: maPhieuThue = 1

Step 1: Get room fee
  Query: SELECT SUM(donGia) FROM ct_phieuthuephong 
         WHERE MaPhieuThue = 1
  Result: 1,000,000

Step 2: Get service fees
  Query: SELECT SUM(soLuong * donGia) FROM sudungdichvu 
         WHERE MaPhieuThue = 1
  Result: 150,000

Step 3: Get penalty
  Query: SELECT SUM(tienBoiThuong) FROM kiemkephong 
         WHERE MaPhieuThue = 1
  Result: 0

Step 4: Calculate total
  Total = 1,000,000 + 150,000 + 0 = 1,150,000

Step 5: Create Invoice
  INSERT INTO hoadon VALUES (
    NULL, 1, 1, NOW(), 1150000
  )
  -> MaHoaDon = 1 (auto-generated)

Step 6: Create Invoice Details
  - INSERT room fee into ct_hoadon
  - INSERT service fees into ct_hoadon
  - INSERT penalties into ct_hoadon

Output: CheckoutResponse with all data
```

---

## 🧪 QUICK TEST

**Scenario: Khách ở 1 đêm, dùng 2 dịch vụ, không hỏng vỡ**

```
1. Add Service 1
   curl -X POST http://localhost:8080/api/billing/add-service \
     -H "Content-Type: application/json" \
     -d '{"maPhieuThue":1,"maDichVu":1,"maPhong":101,"soLuong":2,"donGia":75000}'

2. Add Service 2
   curl -X POST http://localhost:8080/api/billing/add-service \
     -H "Content-Type: application/json" \
     -d '{"maPhieuThue":1,"maDichVu":2,"maPhong":101,"soLuong":1,"donGia":50000}'

3. Record Inspection
   curl -X POST http://localhost:8080/api/billing/record-inspection \
     -H "Content-Type: application/json" \
     -d '{"maPhieuThue":1,"maPhong":101,"maNhanVien":1,"tinhTrang":"OK","tienBoiThuong":0}'

4. Checkout
   curl -X POST http://localhost:8080/api/billing/checkout \
     -H "Content-Type: application/json" \
     -d '{"maPhieuThue":1,"maNhanVien":1}'

Expected Result:
- tongTien = 1,000,000 (room) + 150,000 (2×75k) + 50,000 (1×50k) = 1,200,000
```

---

## 📌 IMPORTANT NOTES

✅ **Build Status:** SUCCESS
✅ **No Frontend Changes:** Per requirement
✅ **Database:** 4 tables integrated
✅ **Error Handling:** All APIs have try-catch
✅ **Validation:** All inputs validated
✅ **Transactions:** All operations @Transactional
✅ **Ready to Test:** Yes, with sample data

---

## 🔗 START SERVER

```bash
cd c:\Users\PC\QuanLyKhachSan_SE330\backend
mvn spring-boot:run
```

Server runs on: `http://localhost:8080`

---

## 📚 DOCUMENTATION

- 📄 **API_BILLING_DOCUMENTATION.md** - Full API specs
- 📄 **TESTING_GUIDE.md** - Test procedures + SQL
- 📄 **PROJECT_STRUCTURE.md** - File structure
- 📄 **SUMMARY.md** - Complete overview

---

## 🎯 NEXT STEPS

1. ✅ Insert test data into database
2. ✅ Start backend server
3. ✅ Test 3 APIs with curl commands
4. ✅ Verify database records
5. ✅ Integration with frontend (optional)

---

**Status:** ✅ READY FOR TESTING
**Version:** 1.0
**Date:** 22/05/2026
