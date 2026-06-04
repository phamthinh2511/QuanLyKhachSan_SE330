# 🤖 CHỨC NĂNG CHI TIẾT CỦA AI CHATBOT HỖ TRỢ NHÂN VIÊN

Tài liệu này tổng hợp toàn bộ các chức năng thông minh mà chatbot trợ lý ảo AI sẽ hỗ trợ nhân viên/lễ tân trong quá trình vận hành khách sạn thực tế.

---

## 1. 🔍 Nhóm Chức Năng Tra Cứu Phòng Trống (Room Availability)
AI có khả năng quét toàn bộ cơ sở dữ liệu phòng trống theo thời gian thực để trả lời nhanh cho nhân viên:
* **Đếm tổng số lượng phòng trống**: 
  * *Ví dụ câu hỏi:* "Hôm nay còn bao nhiêu phòng trống?", "Tình hình phòng trống thế nào?"
* **Tra cứu phòng trống theo Loại phòng (Room Type)**:
  * *Ví dụ câu hỏi:* "Còn phòng Deluxe nào trống không?", "Có bao nhiêu phòng Standard đang trống?"
* **Tra cứu phòng trống theo Sức chứa (Capacity)**:
  * *Ví dụ câu hỏi:* "Còn phòng nào trống cho 4 người không?", "Tìm phòng trống cho nhóm khách 3 người."
* **Tra cứu phòng trống theo Tầng (Floor)**:
  * *Ví dụ câu hỏi:* "Tầng 2 còn phòng trống nào không?"

---

## 2. 📋 Nhóm Chức Năng Kiểm Tra Chi Tiết Phòng (Room Details & Status)
Nhân viên có thể hỏi trực tiếp về thông tin cụ thể của bất kỳ phòng nào trong hệ thống:
* **Kiểm tra trạng thái phòng cụ thể**:
  * *Ví dụ câu hỏi:* "Phòng 203 có khách chưa?", "Phòng 102 đang ở trạng thái nào?"
* **Xem thông tin cấu hình phòng**:
  * *Ví dụ câu hỏi:* "Phòng 305 thuộc loại phòng nào và sức chứa tối đa là bao nhiêu?"

---

## 3. 💵 Nhóm Chức Năng Tra Cứu Giá Cả & Đề Xuất Theo Ngân Sách (Pricing & Recommendations)
AI nắm rõ giá niêm yết của từng loại phòng để tư vấn nhanh cho lễ tân khi làm việc với khách:
* **Tra cứu đơn giá theo Loại phòng**:
  * *Ví dụ câu hỏi:* "Phòng Suite giá bao nhiêu một đêm?", "Giá của phòng Deluxe là bao nhiêu?"
* **Gợi ý phòng theo ngân sách của khách hàng**:
  * *Ví dụ câu hỏi:* "Khách muốn phòng trống dưới 600k thì có những phòng nào?"

---

## 4. 🛠️ Nhóm Chức Năng Tra Cứu Dịch Vụ Khách Sạn (Hotel Services)
Giúp lễ tân nắm bắt nhanh danh mục dịch vụ đang kinh doanh để giới thiệu cho khách hàng:
* **Liệt kê danh sách dịch vụ hiện có**:
  * *Ví dụ câu hỏi:* "Khách sạn mình đang có những dịch vụ gì?", "Có những dịch vụ ăn uống hay spa nào đang mở cửa không?"
* **Kiểm tra dịch vụ cụ thể**:
  * *Ví dụ câu hỏi:* "Khách sạn mình có dịch vụ giặt ủi/thuê xe không?"

---

## 5. 💡 Nhóm Chức Năng Trợ Giúp Vận Hành & Hướng Dẫn Nghiệp Vụ (Operational Guide)
Tận dụng tri thức sẵn có của mô hình ngôn ngữ lớn (LLM) để hướng dẫn nhân viên xử lý các tình huống nghiệp vụ:
* **Hướng dẫn quy trình chuẩn**:
  * *Ví dụ câu hỏi:* "Quy trình check-out cho khách gồm những bước nào?", "Làm thế nào để ghi nhận kiểm kê phòng?"
* **Xử lý tình huống phát sinh**:
  * *Ví dụ câu hỏi:* "Nếu khách làm hỏng TV hoặc mất chìa khóa phòng thì lễ tân xử lý thế nào?" (AI sẽ tư vấn về việc làm biên bản kiểm kê và áp dụng phí bồi thường).
