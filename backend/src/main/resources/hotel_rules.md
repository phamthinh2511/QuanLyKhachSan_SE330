# HƯỚNG DẪN NGHIỆP VỤ & QUY TRÌNH KHÁCH SẠN

Tài liệu này đóng vai trò là tri thức nền tảng giúp AI Assistant trả lời và hướng dẫn nhân viên xử lý các nghiệp vụ hàng ngày.

---

## 🔑 1. Quy Trình Vận Hành Lễ Tân
### 1.1 Quy trình Check-in (Nhận phòng)
1. **Yêu cầu giấy tờ:** Yêu cầu khách hàng xuất trình CCCD hoặc Hộ chiếu (Passport) còn hạn.
2. **Xác nhận đặt phòng:** Kiểm tra thông tin đặt phòng của khách trên phần mềm tại trang [Đặt phòng](/bookings).
3. **Khai báo thông tin:** Điền thông tin cá nhân khách vào mục đăng ký lưu trú.
4. **Bàn giao phòng:** Giao chìa khóa phòng, giới thiệu dịch vụ đi kèm (bữa sáng, hồ bơi...) và chúc khách có kỳ lưu trú vui vẻ.

### 1.2 Quy trình Check-out (Trả phòng)
1. **Kiểm tra phòng:** Nhờ bộ phận buồng phòng kiểm tra trạng thái phòng thực tế (mini bar, thiết bị).
2. **Kiểm tra dịch vụ sử dụng:** Mở phần mềm tại trang [Thanh toán hóa đơn](/billing), kiểm tra xem khách có sử dụng thêm dịch vụ nào (giặt ủi, nước ngọt, thuê xe) để cộng vào hóa đơn.
3. **Thanh toán:** Bấm "Xuất hóa đơn" và thực hiện thu tiền mặt, quẹt thẻ hoặc chuyển khoản.
4. **Trả giấy tờ:** Hoàn trả CCCD/Hộ chiếu cho khách, chào tạm biệt và hẹn gặp lại.

---

## 💸 2. Quy Định Đền Bù Hư Hỏng Vật Tư
Khi kiểm tra phòng check-out, nếu phát hiện mất mát hoặc hư hỏng vật tư, áp dụng mức phí đền bù sau:
- **Làm mất chìa khóa phòng:** Phạt **100,000 VND** chi phí làm lại phôi khóa.
- **Làm hỏng điều hòa / TV:** Phạt **3,000,000 VND**.
- **Làm bẩn, rách chăn ga gối đệm:** Phạt **500,000 VND** chi phí giặt tẩy hoặc thay mới.
- **Làm hỏng hoặc vỡ cốc thủy tinh:** Phạt **50,000 VND** / chiếc.

---

## 🚫 3. Chính Sách Hoàn Hủy Phòng
- **Hủy phòng trước 24h (so với giờ check-in):** Khách hàng được hoàn trả **100%** tiền cọc.
- **Hủy phòng trong vòng 24h:** Khách hàng bị phạt **50%** giá trị tiền cọc.
- **Khách không đến nhận phòng (No-show):** Khách hàng bị phạt **100%** tiền cọc của đêm đầu tiên.

---

## 🖥️ 4. Sơ Đồ Link Điều Hướng Giao Diện (Frontend UI Routing)
Khi nhân viên hỏi cách đi đến các trang chức năng, hãy trả lời kèm link Markdown tương ứng dưới đây:
- **Trang Sơ đồ phòng & Thuê phòng:** `/rooms` (Ví dụ: [Sơ đồ phòng](/rooms))
- **Trang Quản lý Đặt phòng trước:** `/bookings` (Ví dụ: [Danh sách đặt phòng](/bookings))
- **Trang Hóa đơn & Thanh toán:** `/billing` (Ví dụ: [Thanh toán hóa đơn](/billing))
- **Trang Báo cáo doanh thu & Dashboard:** `/dashboard` (Ví dụ: [Báo cáo doanh thu](/dashboard))
- **Trang Quản lý Loại phòng:** `/room-types` (Ví dụ: [Quản lý loại phòng](/room-types))
