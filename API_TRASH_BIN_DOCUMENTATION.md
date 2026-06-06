# ĐẶC TẢ TÍCH HỢP FRONTEND - TÍNH NĂNG THÙNG RÁC (TRASH BIN)

Tài liệu này cung cấp toàn bộ thông tin về các Endpoint, cấu trúc dữ liệu và quy tắc nghiệp vụ cần thiết để lập trình viên Frontend thiết kế giao diện **Thùng rác (Trash Bin)**, **Xóa mềm (Soft Delete)**, **Khôi phục (Restore)** và **Xóa vĩnh viễn (Hard Delete)**.

---

## 1. Cơ Chế Hoạt Động (Workflow)

Hệ thống hỗ trợ 6 danh mục cốt lõi dưới đây để tương tác với Thùng rác:
*   **Khách hàng** (`customers`)
*   **Nhân viên** (`employees`)
*   **Phòng** (`rooms`)
*   **Dịch vụ** (`services`)
*   **Loại phòng** (`room-types`)
*   **Tài khoản** (`accounts`)

### Quy tắc nghiệp vụ cần lưu ý khi thiết kế UI:
1.  **Truy vấn thông thường:** Các danh sách hoạt động thông thường (ví dụ: màn hình quản lý Khách hàng, đặt phòng...) sẽ **tự động loại bỏ** các bản ghi đã xóa mềm.
2.  **Đăng nhập:** Tài khoản đã bị xóa mềm sẽ **bị chặn đăng nhập** ngay lập tức.
3.  **Tự động xóa/khôi phục liên đới:** Khi xóa mềm một **Nhân viên**, hệ thống sẽ tự động xóa mềm **Tài khoản** liên kết của nhân viên đó. Khi **Khôi phục** nhân viên, tài khoản của họ cũng sẽ tự động được khôi phục.
4.  **Xóa vĩnh viễn (Xóa cứng):** 
    *   Hệ thống **chặn xóa vĩnh viễn** nếu bản ghi đó đã từng có giao dịch trong quá khứ (ví dụ: Khách hàng đã có phiếu thuê phòng, Dịch vụ đã được sử dụng...).
    *   *Frontend:* Cần bắt Exception từ API trả về để hiển thị thông báo lỗi thân thiện (ví dụ: `"Không thể xóa vĩnh viễn dịch vụ này vì đã có lịch sử giao dịch liên quan"`).

---

## 2. Chi Tiết Các API Endpoints

Dưới đây là danh sách chi tiết các API cần gọi ứng với từng đối tượng:

### 2.1. Khách Hàng (Customer)
*   **Xóa mềm (Đưa vào thùng rác):**
    *   *Method / URL:* `DELETE /api/customers/{id}`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `204 No Content`
*   **Lấy danh sách thùng rác:**
    *   *Method / URL:* `GET /api/customers/trash`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `200 OK` (Trả về mảng danh sách khách hàng đã xóa mềm)
*   **Khôi phục khách hàng:**
    *   *Method / URL:* `PUT /api/customers/{id}/restore`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `200 OK` (Trả về Object khách hàng đã khôi phục)
*   **Xóa vĩnh viễn:**
    *   *Method / URL:* `DELETE /api/customers/{id}/hard`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `204 No Content` (Hoặc trả về lỗi `400`/`500` nếu bị ràng buộc khóa ngoại)

---

### 2.2. Nhân Viên (Employee)
*   **Xóa mềm (Đưa vào thùng rác):**
    *   *Method / URL:* `DELETE /api/employees/{id}`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* Định dạng wrapper `ApiResponse` chuẩn:
        ```json
        {
          "code": 200,
          "message": "Xóa nhân viên thành công",
          "result": null
        }
        ```
*   **Lấy danh sách thùng rác:**
    *   *Method / URL:* `GET /api/employees/trash`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `ApiResponse` chứa mảng nhân viên đã xóa mềm.
*   **Khôi phục nhân viên:**
    *   *Method / URL:* `PUT /api/employees/{id}/restore`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `ApiResponse` chứa thông tin nhân viên đã phục hồi.
*   **Xóa vĩnh viễn:**
    *   *Method / URL:* `DELETE /api/employees/{id}/hard`
    *   *Quyền truy cập:* `ADMIN`
    *   *Response:* `ApiResponse` hoặc thông báo lỗi nếu có ràng buộc lịch sử.

---

### 2.3. Phòng (Room)
*   **Xóa mềm:** `DELETE /api/rooms/{id}` -> `204 No Content`
*   **Lấy danh sách thùng rác:** `GET /api/rooms/trash` -> `200 OK` (mảng Room)
*   **Khôi phục:** `PUT /api/rooms/{id}/restore` -> `200 OK`
*   **Xóa vĩnh viễn:** `DELETE /api/rooms/{id}/hard` -> `204 No Content` (hoặc lỗi nếu phòng đã từng được đặt)

---

### 2.4. Dịch Vụ (Service)
*   **Xóa mềm:** `DELETE /api/services/{id}` -> `ApiResponse`
*   **Lấy danh sách thùng rác:** `GET /api/services/trash` -> `ApiResponse`
*   **Khôi phục:** `PUT /api/services/{id}/restore` -> `ApiResponse`
*   **Xóa vĩnh viễn:** `DELETE /api/services/{id}/hard` -> `ApiResponse` (hoặc lỗi nếu dịch vụ đã có hóa đơn sử dụng)

---

### 2.5. Loại Phòng (Room Type)
*   **Xóa mềm:** `DELETE /api/room-types/{id}` -> `204 No Content`
*   **Lấy danh sách thùng rác:** `GET /api/room-types/trash` -> `200 OK`
*   **Khôi phục:** `PUT /api/room-types/{id}/restore` -> `200 OK`
*   **Xóa vĩnh viễn:** `DELETE /api/room-types/{id}/hard` -> `204 No Content` (hoặc lỗi nếu vẫn còn phòng thuộc loại này)

---

### 2.6. Tài Khoản (Account)
*   **Xóa mềm:** `DELETE /api/accounts/{id}` -> `ApiResponse`
*   **Lấy danh sách thùng rác:** `GET /api/accounts/trash` -> `ApiResponse`
*   **Khôi phục:** `PUT /api/accounts/{id}/restore` -> `ApiResponse`
*   **Xóa vĩnh viễn:** `DELETE /api/accounts/{id}/hard` -> `ApiResponse` (hoặc lỗi nếu tài khoản đang liên kết với nhân viên)

---

## 3. Gợi Ý Thiết Kế UI/UX Cho Frontend

1.  **Giao diện Danh sách chính:** 
    *   Bổ sung thêm một nút bấm hoặc icon **"Thùng rác"** ở góc trên cùng của các màn hình quản lý (ví dụ: Quản lý Phòng, Quản lý Khách hàng). Click vào nút này sẽ mở ra màn hình/modal danh sách các bản ghi đã xóa tương ứng.
2.  **Màn hình Thùng rác:**
    *   Hiển thị danh sách bảng các thực thể đã xóa mềm.
    *   Mỗi dòng dữ liệu trong thùng rác sẽ có 2 nút hành động:
        *   **Khôi phục (Restore):** Icon mũi tên quay lại / Đồng hồ quay lại. Khi click, gọi `PUT /{id}/restore` -> Hiển thị thông báo thành công và load lại thùng rác.
        *   **Xóa vĩnh viễn (Hard Delete):** Icon thùng rác đỏ / X đỏ. Khi click, hiển thị cảnh báo: *"Hành động này không thể hoàn tác, bạn có chắc chắn muốn xóa vĩnh viễn?"*. Nếu đồng ý -> Gọi `DELETE /{id}/hard`.
3.  **Xử lý Lỗi Xóa vĩnh viễn:**
    *   Khi gọi API xóa cứng bị lỗi (mã lỗi `400` hoặc `500`), Frontend cần đọc message lỗi từ backend trả về và hiển thị lên Toast/Alert thông báo rõ cho người dùng lý do không thể xóa vĩnh viễn (ví dụ: do ràng buộc lịch sử đặt phòng).
