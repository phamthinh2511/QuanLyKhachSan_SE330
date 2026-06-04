# 🚀 CHI TIẾT CẢI TIẾN AI & TÁC ĐỘNG CỤ THỂ ĐẾN ĐỒ ÁN QUẢN LÝ KHÁCH SẠN

Tài liệu này mô tả chi tiết cách triển khai 3 ý tưởng cải tiến AI (Phân tích cảm xúc, Chatbot hỗ trợ nội bộ, Giá phòng động) và các vị trí cụ thể bị tác động trong mã nguồn hiện tại của dự án.

---

## 📌 Ý TƯỞNG 1: Phân Tích Cảm Xúc & Ý Kiến Khách Hàng Bằng AI (AI Sentiment Analysis)

### 1. Tác Động Cơ Sở Dữ Liệu (Database)
Cần bổ sung các trường thông tin lưu trữ nhận xét và kết quả phân tích của AI vào bảng Hóa đơn:
* **Bảng `hoadon`**:
  * Thêm cột `danh_gia` (`TEXT`, cho phép NULL): Lưu nguyên văn lời nhận xét của khách khi trả phòng.
  * Thêm cột `cam_xuc` (`VARCHAR(20)`, cho phép NULL): Lưu kết quả phân tích cảm xúc từ AI (`POSITIVE`, `NEGATIVE`, `NEUTRAL`).
  * Thêm cột `nhan_dich_vu` (`VARCHAR(255)`, cho phép NULL): Lưu danh sách các tag chính cách nhau bằng dấu phẩy do AI tự động trích xuất (Ví dụ: `#PhongBan`, `#NhanVienNhietTinh`, `#GiaCaPhaiChang`).

### 2. Tác Động Backend (Spring Boot)
* **Entity Class (`Hoadon.java`)**:
  * Khai báo thêm 3 trường tương ứng: `danhGia`, `camXuc`, `nhanDichVu` kèm các JPA Mapping.
* **DTO Response (`InvoiceResponseDto.java`)**:
  * Thêm các thuộc tính mới để trả về Frontend: `danhGia`, `camXuc`, `nhanDichVu`.
* **Service Layer (`InvoiceService.java` hoặc `BillingService.java`)**:
  * Viết phương thức `analyzeFeedback(Integer hoadonId, String feedbackText)`:
    * Gửi text qua API của Google Gemini với Prompt yêu cầu phân loại cảm xúc dưới định dạng JSON:
      ```json
      {
        "sentiment": "POSITIVE | NEGATIVE | NEUTRAL",
        "tags": ["#Tag1", "#Tag2"]
      }
      ```
    * Parse kết quả JSON nhận được từ Gemini và lưu vào Database.
* **Controller Layer (`InvoiceController.java`)**:
  * Thêm API endpoint: `POST /api/invoices/{id}/feedback` nhận vào một request body chứa lời đánh giá của khách hàng và chạy phương thức phân tích AI trên.

### 3. Tác Động Frontend (Next.js)
* **Component (`InvoiceDetailModal.tsx`)**:
  * Thêm một khung văn bản (Textarea) "Ghi nhận đánh giá của khách" khi check-out hoặc khi xem hóa đơn.
  * Thêm nút "Gửi & Phân tích AI", khi nhấn sẽ gọi API `POST /api/invoices/{id}/feedback` và hiển thị kết quả cảm xúc (Kèm emoji màu sắc) và các thẻ tag nổi bật ngay trên Modal.
* **Page Dashboard/Reports (`reports/page.tsx` hoặc `dashboard/page.tsx`)**:
  * Dành cho **Admin**: Vẽ thêm 1 biểu đồ hình tròn (Pie Chart của Recharts) thống kê tỷ lệ khách hàng hài lòng (`POSITIVE`/`NEGATIVE`/`NEUTRAL`).
  * Hiển thị bảng xếp hạng các hashtag phàn nàn nhiều nhất để Admin kịp thời chấn chỉnh chất lượng phòng hoặc nhân sự.

---

## 📌 Ý TƯỞNG 2: Chatbot Trợ Lý Ảo AI Cho Nhân Viên (AI Staff Assistant Chatbot)

### 1. Tác Động Cơ Sở Dữ Liệu (Database)
* (Tùy chọn) Bảng `ai_chat_log` (id, ma_nhan_vien, cau_hoi, cau_tra_loi, ngay_tao) nếu muốn Admin giám sát các câu hỏi của nhân viên. Nếu không cần lưu lịch sử lâu dài, không cần sửa DB.

### 2. Tác Động Backend (Spring Boot)
* **Tạo Controller mới (`AiChatController.java`)**:
  * Endpoint: `POST /api/ai/chat` nhận vào tin nhắn của nhân viên và trả về câu trả lời của AI.
* **Tạo Service mới (`AiChatService.java`)**:
  * Triển khai kỹ thuật **RAG (Retrieval-Augmented Generation) đơn giản**:
    * Trước khi gửi câu hỏi của nhân viên sang Gemini, Service sẽ tự động query các thông tin thời gian thực từ DB như:
      * Số lượng phòng trống hiện tại (`phongRepository.countByTrangThai("Trống")`).
      * Các dịch vụ đang chạy của khách sạn.
    * Gộp thông tin tĩnh này vào phần System Prompt gửi cho Gemini. Ví dụ:
      > *"Bạn là trợ lý ảo khách sạn. Đây là dữ liệu phòng trống hiện tại: [Danh sách phòng]. Đây là câu hỏi của nhân viên: [Câu hỏi]. Hãy trả lời chính xác dựa trên dữ liệu này."*
    * Gọi Gemini API và trả kết quả về cho Controller.

### 3. Tác Động Frontend (Next.js)
* **Tạo Component Giao Diện Mới (`components/ui/ChatbotWidget.tsx`)**:
  * Một bong bóng chat (Floating Chat Bubble) màu xanh dương đặc trưng ở góc phải màn hình, hiển thị trên tất cả các trang của nhân viên (Employee).
  * Khi click sẽ mở ra một hộp thoại chat nhỏ, có hiệu ứng gõ phím của AI (`isTyping...`) và lưu lịch sử chat tạm thời trong `sessionStorage`.
* **Sidebar (`Sidebar.tsx`)**:
  * Có thể thêm một Tab điều hướng riêng tên là "Trợ lý AI" trỏ đến trang `/chatbot` toàn màn hình nếu không muốn làm dạng bong bóng chat góc màn hình.

---

## 📌 Ý TƯỞNG 3: Tối Ưu Hóa Giá Phòng Động Bằng AI (AI-Powered Dynamic Pricing)

### 1. Tác Động Cơ Sở Dữ Liệu (Database)
* **Bảng `loaiphong`**:
  * Thêm cột `gia_khuyen_nghi` (`DOUBLE`, mặc định 0.0): Giá phòng tối ưu do AI đề xuất.
  * Thêm cột `ly_do_khuyen_nghi` (`VARCHAR(255)`): Giải thích lý do tăng/giảm giá của AI.

### 2. Tác Động Backend (Spring Boot)
* **Entity Class (`Loaiphong.java` & `LoaiphongResponseDto.java`)**:
  * Khai báo thêm thuộc tính `giaKhuyenNhi` và `lyDoKhuyenNghi`.
* **Tạo Service mới (`DynamicPricingService.java`)**:
  * Phương thức `calculateRecommendedPrices()`:
    * Thống kê tỷ lệ lấp đầy phòng trung bình của 7 ngày qua.
    * Lấy thông tin ngày trong tuần (Hôm nay có phải cuối tuần hay không).
    * Gửi dữ liệu thống kê này sang Gemini với luật (Rule-based Prompt) yêu cầu AI tối ưu giá. Ví dụ: *"Tỷ lệ lấp đầy phòng Deluxe hiện tại là 90%, hôm nay là thứ 7. Hãy đề xuất tăng giá phòng Deluxe thêm 15% và trả về lý do."*
    * Cập nhật giá khuyến nghị mới vào bảng `loaiphong`.
* **Controller Layer (`LoaiphongController.java`)**:
  * Thêm API: `POST /api/room-types/update-pricing-recommendation` để Admin kích hoạt AI tính giá mới.
  * Thêm API: `PUT /api/room-types/{id}/apply-recommended-price` để Admin đồng ý áp dụng giá phòng do AI đề xuất làm giá bán chính thức.

### 3. Tác Động Frontend (Next.js)
* **Page (`room-types/page.tsx`)**:
  * Dành cho **Admin**: Giao diện Quản lý loại phòng sẽ hiển thị thêm 2 cột:
    1. **Giá Khuyến Nghị AI** (Kèm theo hiệu ứng lấp lánh AI và số tiền nổi bật màu xanh lá cây hoặc đỏ tùy vào việc tăng hay giảm giá).
    2. **Lý do đề xuất** (Ví dụ: *"Cuối tuần + Tỉ lệ phòng trống dưới 15%"*).
  * Thêm nút "Áp dụng giá AI" cạnh giá phòng hiện hành. Khi Admin click, giá phòng mới sẽ được cập nhật vào hệ thống ngay lập tức.
