// "use client";
//
// import { useState, useEffect } from "react";
// import { X } from "lucide-react";
// import { Booking, BookingStatus } from "@/types/booking";
//
// export interface CustomerResponse {
//   id: number;
//   name: string;
//   phone?: string;
// }
//
// export interface LoaiPhongResponseDto {
//   id: number;
//   tenLoaiPhong: string;
//   donGia: number;
// }
//
// export interface RoomResponse {
//   id: number;
//   maLoaiPhong: LoaiPhongResponseDto;
//   trangThai: string;
// }
//
// interface Props {
//   booking: Booking | null;
//   customers: CustomerResponse[]; // Khai báo trong Props
//   rooms: RoomResponse[];         // Khai báo trong Props
//   onSave: (data: any) => void;
//   onClose: () => void;
// }
//
// const todayStr = new Date().toISOString().split("T")[0];
//
// const emptyForm = {
//   customerId: "",
//   roomId: "",
//   customerName: "",
//   roomNumber: "",
//   bookingDate: todayStr,
//   checkIn: todayStr,
//   checkOut: "",
//   guests: 1,
//   roomPrice: 0,
//   amount: 0,
//   status: "Booked" as BookingStatus,
// };
//
// // ĐỂ Ý: Đã bổ sung nhận "customers" và "rooms" ở dòng bóc tách dưới đây
// export default function BookingModal({ booking, customers = [], rooms = [], onSave, onClose }: Props) {
//   const [form, setForm] = useState(emptyForm);
//
//   useEffect(() => {
//     if (booking) {
//       const { id, bookingCode, ...rest } = booking as any;
//       const currentCustomer = customers.find((c) => c.name === rest.customerName);
//       const currentRoom = rooms.find((r) => String(r.id) === rest.roomNumber);
//
//       setForm({
//         ...emptyForm,
//         ...rest,
//         customerId: currentCustomer ? String(currentCustomer.id) : "",
//         roomId: currentRoom ? String(currentRoom.id) : "",
//         roomPrice: currentRoom ? (currentRoom.maLoaiPhong?.donGia || 0) : 0,
//         bookingDate: rest.bookingDate || todayStr,
//         status: rest.status || "Booked"
//       });
//     } else {
//       setForm(emptyForm);
//     }
//   }, [booking, customers, rooms]);
//
//   useEffect(() => {
//     if (form.status === "Checked-in") {
//       setForm((prev) => ({
//         ...prev,
//         bookingDate: todayStr,
//         checkIn: todayStr,
//       }));
//     }
//   }, [form.status]);
// // Thêm đoạn này vào bên trong BookingModal Component của bạn
// useEffect(() => {
//   // Nếu có dữ liệu đơn cần sửa (booking) và danh sách phòng/khách đã load xong
//   if (booking && customers.length > 0 && rooms.length > 0) {
//     // Tìm ID khách hàng dựa vào tên hiển thị trên bảng dữ liệu
//     const foundCustomer = customers.find((c) => c.name === booking.customerName);
//     // Tìm ID phòng dựa vào số phòng hiển thị trên bảng dữ liệu
//     const foundRoom = rooms.find((r) => String(r.id) === booking.roomNumber);
//
//     // Điền tự động toàn bộ thông tin chi tiết cũ vào form nhập liệu
//     setForm({
//       bookingType: (booking as any).loaiHinh || "DAT_TRUOC",
//       customerId: foundCustomer ? String(foundCustomer.id) : "",
//       roomId: foundRoom ? String(foundRoom.id) : "",
//       checkIn: booking.checkIn,
//       checkOut: booking.checkOut,
//       roomPrice: foundRoom ? (foundRoom.maLoaiPhong?.donGia || 0) : 0,
//       amount: booking.amount,
//       guests: booking.guests,
//       status: booking.status
//     });
//   } else {
//     // Nếu bấm nút "Đặt phòng mới" (booking = null) thì reset form về trống
//     setForm(emptyForm);
//   }
// }, [booking, customers, rooms]);
//
//   const handleRoomSelection = (roomIdStr: string) => {
//     const selectedRoom = rooms.find((r) => String(r.id) === roomIdStr);
//     setForm((prev) => ({
//       ...prev,
//       roomId: roomIdStr,
//       roomNumber: selectedRoom ? String(selectedRoom.id) : "",
//       roomPrice: selectedRoom ? (selectedRoom.maLoaiPhong?.donGia || 0) : 0,
//     }));
//   };
//
//   useEffect(() => {
//     if (!form.checkIn || !form.checkOut || !form.roomId) return;
//     const nights = Math.max(
//       0,
//       (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
//     );
//     setForm((prev) => ({ ...prev, amount: prev.roomPrice * nights }));
//   }, [form.roomId, form.checkIn, form.checkOut, form.roomPrice]);
//
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//
//     const bookingType = form.status === "Checked-in" ? "THUE_TRUC_TIEP" : "DAT_TRUOC";
//     const selectedCustomer = customers.find((c) => String(c.id) === form.customerId);
//     const selectedRoom = rooms.find((r) => String(r.id) === form.roomId);
//
//     if (!selectedCustomer) {
//       alert("Vui lòng chọn khách hàng!");
//       return;
//     }
//     if (!selectedRoom) {
//       alert("Vui lòng chọn phòng!");
//       return;
//     }
//     if (!form.checkOut) {
//       alert("Vui lòng chọn ngày check-out!");
//       return;
//     }
//
//     onSave({
//       bookingType,
//       customerId: form.customerId,
//       customerName: selectedCustomer.name,
//       roomId: form.roomId,
//       roomNumber: String(selectedRoom.id),
//       checkIn: form.checkIn,
//       checkOut: form.checkOut,
//       bookingDate: form.bookingDate,
//       roomPrice: form.roomPrice,
//       guests: form.guests,
//       amount: form.amount,
//       status: form.status
//     });
//   };
//
//   const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800";
//
//   return (
//     <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
//         <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
//           <div>
//             <h2 className="font-semibold text-gray-800 text-lg">
//               {booking ? "Chỉnh sửa booking" : "Đặt phòng mới"}
//             </h2>
//             <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin đặt phòng bên dưới</p>
//           </div>
//           <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
//             <X className="w-4 h-4 text-gray-500" />
//           </button>
//         </div>
//
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức / Trạng thái</label>
//             <select value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
//               className={inputClass}>
//               <option value="Chưa nhận">Đặt phòng trước (Booked)</option>
//               <option value="Đã nhận phòng">Thuê trực tiếp tại quầy (Checked-in)</option>
//               <option value="Đã trả phòng">Đã trả phòng (Checked-out)</option>
//               <option value="Đã hủy">Đã hủy (Cancelled)</option>
//             </select>
//           </div>
//
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Khách hàng <span className="text-red-500">*</span>
//               </label>
//               <select
//                 value={form.customerId}
//                 onChange={(e) => setForm({ ...form, customerId: e.target.value })}
//                 className={inputClass}
//                 required
//               >
//                 <option value="">-- Chọn khách hàng --</option>
//                 {Array.isArray(customers) && customers.map((c) => (
//                   <option key={c.id} value={c.id}>
//                     {c.name} (ID: {c.id})
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Phòng lưu trú <span className="text-red-500">*</span></label>
//               <select
//                 value={form.roomId}
//                 onChange={(e) => handleRoomSelection(e.target.value)}
//                 className={inputClass}
//                 required
//               >
//                 <option value="">-- Chọn phòng --</option>
//                 {Array.isArray(rooms) && rooms.map((r) => (
//                   <option key={r.id} value={r.id}>
//                     Mã P.{r.id} — {r.maLoaiPhong?.tenLoaiPhong || "Chưa rõ"} ({r.maLoaiPhong?.donGia?.toLocaleString("vi-VN")}đ)
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
//
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt đơn</label>
//             <input
//               type="date"
//               value={form.bookingDate}
//               disabled={form.status === "Checked-in"}
//               onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
//               className={`${inputClass} ${form.status === "Checked-in" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
//               required
//             />
//           </div>
//
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-in</label>
//               <input type="date" value={form.checkIn}
//                 disabled={form.status === "Checked-in"}
//                 onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
//                 className={`${inputClass} ${form.status === "Checked-in" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
//                 required />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-out</label>
//               <input type="date" value={form.checkOut}
//                 min={form.checkIn}
//                 onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
//                 className={inputClass} required />
//             </div>
//           </div>
//
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Số khách</label>
//               <input type="number" min={1} value={form.guests}
//                 onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
//                 className={inputClass} required />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VND)</label>
//               <input type="text" value={form.amount.toLocaleString("vi-VN") + " đ"} readOnly
//                 className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
//             </div>
//           </div>
//
//           <div className="flex gap-3 pt-2">
//             <button type="button" onClick={onClose}
//               className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
//               Hủy
//             </button>
//             <button type="submit"
//               className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
//               {booking ? "Lưu thay đổi" : "Tạo booking"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";

export interface CustomerResponse {
  id: number;
  name: string;
  phone?: string;
}

export interface LoaiPhongResponseDto {
  id: number;
  tenLoaiPhong: string;
  donGia: number;
}

export interface RoomResponse {
  id: number;
  maLoaiPhong: LoaiPhongResponseDto;
  trangThai: string;
}

interface Props {
  booking: Booking | null;
  customers: CustomerResponse[];
  rooms: RoomResponse[];
  onSave: (data: any) => void;
  onClose: () => void;
}

const todayStr = new Date().toISOString().split("T")[0];

const emptyForm = {
  customerId: "",
  roomId: "",
  customerName: "",
  roomNumber: "",
  bookingDate: todayStr,
  checkIn: todayStr,
  checkOut: "",
  guests: 1,
  roomPrice: 0,
  amount: 0,
  status: "Chưa nhận" as BookingStatus, // ĐỒNG BỘ: Mặc định tiếng Việt
};

export default function BookingModal({ booking, customers = [], rooms = [], onSave, onClose }: Props) {
  const [form, setForm] = useState(emptyForm);

  // LOGIC 1: Đồng bộ nạp dữ liệu cũ khi ấn "Sửa"
  useEffect(() => {
    if (booking && customers.length > 0 && rooms.length > 0) {
      const foundCustomer = customers.find((c) => c.name === booking.customerName);
      const foundRoom = rooms.find((r) => String(r.id) === booking.roomNumber);

      setForm({
        bookingType: (booking as any).loaiHinh || (booking.status === "Đã nhận phòng" ? "THUE_TRUC_TIEP" : "DAT_TRUOC"),
        customerId: foundCustomer ? String(foundCustomer.id) : "",
        roomId: foundRoom ? String(foundRoom.id) : "",
        customerName: booking.customerName || "",
        roomNumber: booking.roomNumber || "",
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        bookingDate: (booking as any).bookingDate || todayStr,
        roomPrice: foundRoom ? (foundRoom.maLoaiPhong?.donGia || 0) : 0,
        amount: booking.amount,
        guests: booking.guests,
        status: booking.status as BookingStatus // Nhận trực tiếp chuỗi tiếng Việt từ Backend
      });
    } else {
      setForm(emptyForm);
    }
  }, [booking, customers, rooms]);

  // LOGIC 2: Nếu chọn Thuê trực tiếp tại quầy thì khóa ngày và ép về Hôm nay
  useEffect(() => {
    if (form.status === "Đã nhận phòng tại quầy") { // ĐỒNG BỘ: Đổi từ "Checked-in" sang tiếng Việt
      setForm((prev) => ({
        ...prev,
        bookingDate: todayStr,
        checkIn: todayStr,
      }));
    }
  }, [form.status]);

  // LOGIC 3: Xử lý chọn phòng để cập nhật đơn giá và mã phòng
  const handleRoomSelection = (roomIdStr: string) => {
    const selectedRoom = rooms.find((r) => String(r.id) === roomIdStr);
    setForm((prev) => ({
      ...prev,
      roomId: roomIdStr,
      roomNumber: selectedRoom ? String(selectedRoom.id) : "",
      roomPrice: selectedRoom ? (selectedRoom.maLoaiPhong?.donGia || 0) : 0,
    }));
  };

  // LOGIC 4: Tự động tính tiền dựa vào số ngày đêm lưu trú
  useEffect(() => {
    if (!form.checkIn || !form.checkOut || !form.roomId) return;
    const nights = Math.max(
      0,
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
    );
    setForm((prev) => ({ ...prev, amount: prev.roomPrice * nights }));
  }, [form.roomId, form.checkIn, form.checkOut, form.roomPrice]);

  // LOGIC 5: Đóng gói dữ liệu khi bấm nút Lưu
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ĐỒNG BỘ: Phân tách hình thức dựa trên trạng thái tiếng Việt mới chọn
    const bookingType = form.status === "Đã nhận phòng" ? "THUE_TRUC_TIEP" : "DAT_TRUOC";
    const selectedCustomer = customers.find((c) => String(c.id) === form.customerId);
    const selectedRoom = rooms.find((r) => String(r.id) === form.roomId);

    if (!selectedCustomer) {
      alert("Vui lòng chọn khách hàng!");
      return;
    }
    if (!selectedRoom) {
      alert("Vui lòng chọn phòng!");
      return;
    }
    if (!form.checkOut) {
      alert("Vui lòng chọn ngày check-out!");
      return;
    }
    const phongSucChua = selectedRoom.maLoaiPhong?.sucChuaToiDa || selectedRoom.sucChua || 0;
        if (phongSucChua > 0 && form.guests > phongSucChua) {
          alert(`Thao tác thất bại: Phòng này chỉ chứa tối đa ${phongSucChua} người, đơn của bạn có ${form.guests} khách!`);
          return;
        }
    onSave({
      bookingType,
      customerId: form.customerId,
      customerName: selectedCustomer.name,
      roomId: form.roomId,
      roomNumber: String(selectedRoom.id),
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      bookingDate: form.bookingDate,
      roomPrice: form.roomPrice,
      guests: form.guests,
      amount: form.amount,
      status: form.status.trim() // Gửi chuỗi tiếng Việt sạch xuống page.tsx
    });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {booking ? "Chỉnh sửa booking" : "Đặt phòng mới"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin đặt phòng bên dưới</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hình thức / Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
              className={inputClass}
            >
              <option value="Chưa nhận">Đặt phòng trước (Booked)</option>
                            {/* 👉 ĐÃ SỬA: Xóa bỏ hoàn toàn khoảng trắng ở cuối value */}
                            <option value="Đã nhận phòng tại quầy">Thuê trực tiếp tại quầy (Checked-in)</option>
                            <option value="Đã nhận phòng đặt trước">Nhận phòng đặt trước</option>
                            <option value="Đã trả phòng">Đã trả phòng (Checked-out)</option>
                            <option value="Đã hủy">Đã hủy (Cancelled)</option>

            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khách hàng <span className="text-red-500">*</span>
              </label>
              <select
                value={form.customerId}
                onChange={(e) => setForm({ ...form, customerId: e.target.value })}
                className={inputClass}
                required
              >
                <option value="">-- Chọn khách hàng --</option>
                {Array.isArray(customers) && customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (ID: {c.id})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng lưu trú <span className="text-red-500">*</span></label>
              <select
                value={form.roomId}
                onChange={(e) => handleRoomSelection(e.target.value)}
                className={inputClass}
                required
              >
                <option value="">-- Chọn phòng --</option>
                {Array.isArray(rooms) &&
                      rooms
                        // LOGIC: Chỉ hiện phòng "Trống" HOẶC phòng đang được chọn của chính đơn này (khi Sửa)
                        .filter((r) => r.trangThai === "Trống" || String(r.id) === form.roomId)
                        .map((r) => (
                          <option key={r.id} value={r.id}>
                            Mã P.{r.id} — {r.maLoaiPhong?.tenLoaiPhong || "Chưa rõ"} (Sức chứa: {r.maLoaiPhong?.sucChuaToiDa || r.sucChua || 2} người) {String(r.id) === form.roomId ? " [Phòng hiện tại]" : ""}
                          </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày đặt đơn</label>
            <input
              type="date"
              value={form.bookingDate}
              disabled={form.status === "Đã nhận phòng tại quầy"}
              onChange={(e) => setForm({ ...form, bookingDate: e.target.value })}
              className={`${inputClass} ${form.status === "Đã nhận phòng" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-in</label>
              <input
                type="date"
                value={form.checkIn}
                disabled={form.status === "Đã nhận phòng"}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className={`${inputClass} ${form.status === "Đã nhận phòng tại quầy" ? "bg-gray-50 text-gray-400 cursor-not-allowed" : ""}`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-out</label>
              <input
                type="date"
                value={form.checkOut}
                min={form.checkIn}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                className={inputClass}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số khách</label>
              <input
                  type="number"
                  min={1}
                  // Cho phép hiển thị rỗng khi người dùng bấm nút xóa (Backspace) trên bàn phím
                  value={form.guests === 0 ? "" : form.guests}
                  onChange={(e) => {
                    const val = e.target.value;
                    // Nếu xóa hết chữ thì tạm thời để giá trị bằng 0 để giao diện không bị khóa cứng
                    setForm({ ...form, guests: val === "" ? 0 : parseInt(val) });
                  }}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-slate-800 focus:ring-2 focus:ring-blue-500"
                  required
                />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VND)</label>
              <input
                type="text"
                value={form.amount.toLocaleString("vi-VN") + " đ"}
                readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {booking ? "Lưu thay đổi" : "Tạo booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}