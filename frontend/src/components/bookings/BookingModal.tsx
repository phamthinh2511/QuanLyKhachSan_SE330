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
import { X, User, CalendarDays, Sparkles, Key, Check } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";
import { getCustomers } from "@/lib/api/customers";
import { mapBookingStatus } from "@/app/(dashboard)/bookings/page";
import { getRooms } from "@/lib/api/rooms";
import { Customer } from "@/types/customer";
import { Room } from "@/types/room";

interface Props {
  booking: Booking | null;
  onSave: (data: any) => void;
  onClose: () => void;
}

export interface ExtendedForm {
  customerId?: number | null;
  customerName: string;
  customerPhone: string;
  customerGender: string;
  customerBirthday: string;
  customerAddress: string;
  customerEmail: string;
  customerIdCard: string;
  customerStatus: string;

  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: BookingStatus;
}

const emptyForm: ExtendedForm = {
  customerId: null,
  customerName: "",
  customerPhone: "",
  customerGender: "Nam",
  customerBirthday: "",
  customerAddress: "",
  customerEmail: "",
  customerIdCard: "",
  customerStatus: "Thường",
  roomNumber: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
  amount: 0,
  status: "Đã đặt",
};

export default function BookingModal({ booking, onSave, onClose }: Props) {
  const [form, setForm] = useState<ExtendedForm>(emptyForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const filteredCustomers = searchQuery.trim() === ""
    ? customers
    : customers.filter((c) =>
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        (c.idCard && c.idCard.includes(searchQuery)) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Fetch customers and rooms on load
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [custData, roomData] = await Promise.all([
          getCustomers(),
          getRooms(),
        ]);
        setCustomers(custData);
        setRooms(roomData);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu trong Modal:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Populate form in edit mode
  useEffect(() => {
    if (booking) {
      const cust = customers.find((c) => c.name === booking.customerName);
      setForm({
        customerId: cust?.id || null,
        customerName: booking.customerName || "",
        customerPhone: cust?.phone || "",
        customerGender: cust?.gender || "Nam",
        customerBirthday: cust?.birthday || "",
        customerAddress: cust?.address || "",
        customerEmail: cust?.email || "",
        customerIdCard: cust?.idCard || "",
        customerStatus: cust?.status || "Thường",
        roomNumber: booking.roomNumber || "",
        checkIn: booking.checkIn || "",
        checkOut: booking.checkOut || "",
        guests: booking.guests || 1,
        amount: booking.amount || 0,
        status: booking.status || "Đã đặt",
      });
      if (cust) {
        setIsAutoFilled(true);
      }
    } else {
      setForm(emptyForm);
      setIsAutoFilled(false);
    }
  }, [booking, customers]);

  // Calculate booking amount dynamically
  useEffect(() => {
    if (!form.roomNumber || !form.checkIn || !form.checkOut) return;
    const room = rooms.find((r) => r.roomNumber === form.roomNumber);
    if (!room) return;
    const nights = Math.max(
      0,
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
    );
    setForm((prev) => ({ ...prev, amount: room.pricePerNight * nights }));
  }, [form.roomNumber, form.checkIn, form.checkOut, rooms]);

  // Watch for phone, cccd/passport, email to auto-complete existing customer details
  const handleCustomerFieldChange = (field: keyof ExtendedForm, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };

      const searchPhone = field === "customerPhone" ? value.trim() : prev.customerPhone.trim();
      const searchIdCard = field === "customerIdCard" ? value.trim() : prev.customerIdCard.trim();
      const searchEmail = field === "customerEmail" ? value.trim() : prev.customerEmail.trim();

      let matched: Customer | undefined;

      if (searchPhone.length >= 9) {
        matched = customers.find((c) => c.phone && c.phone.trim() === searchPhone);
      }
      if (!matched && searchIdCard.length >= 9) {
        matched = customers.find((c) => c.idCard && c.idCard.trim() === searchIdCard);
      }
      if (!matched && searchEmail.length >= 5 && searchEmail.includes("@")) {
        matched = customers.find((c) => c.email && c.email.trim().toLowerCase() === searchEmail.toLowerCase());
      }

      if (matched) {
        setIsAutoFilled(true);
        return {
          ...updated,
          customerId: matched.id,
          customerName: matched.name || updated.customerName,
          customerPhone: matched.phone || updated.customerPhone,
          customerGender: matched.gender || updated.customerGender,
          customerBirthday: matched.birthday || updated.customerBirthday,
          customerAddress: matched.address || updated.customerAddress,
          customerEmail: matched.email || updated.customerEmail,
          customerIdCard: matched.idCard || updated.customerIdCard,
          customerStatus: matched.status || updated.customerStatus,
        };
      } else {
        return {
          ...updated,
          customerId: null,
        };
      }
    });
  };

  const handleSelectExistingCustomer = (customerId: number) => {
    const matched = customers.find((c) => c.id === customerId);
    if (matched) {
      setIsAutoFilled(true);
      setForm((prev) => ({
        ...prev,
        customerId: matched.id,
        customerName: matched.name,
        customerPhone: matched.phone,
        customerGender: matched.gender,
        customerBirthday: matched.birthday,
        customerAddress: matched.address,
        customerEmail: matched.email,
        customerIdCard: matched.idCard,
        customerStatus: matched.status,
      }));
    }
  };

  const resetCustomerForm = () => {
    setIsAutoFilled(false);
    setForm((prev) => ({
      ...prev,
      customerId: null,
      customerName: "",
      customerPhone: "",
      customerGender: "Nam",
      customerBirthday: "",
      customerAddress: "",
      customerEmail: "",
      customerIdCard: "",
      customerStatus: "Thường",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ĐỒNG BỘ: Phân tách hình thức dựa trên trạng thái tiếng Việt mới chọn
    const bookingType = form.status === "Checked-in" ? "THUE_TRUC_TIEP" : "DAT_TRUOC";
    const selectedCustomer = customers.find((c) => c.id === form.customerId);
    const selectedRoom = rooms.find((r) => r.roomNumber === form.roomNumber);

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
    const phongSucChua = selectedRoom.capacity || 0;
    if (phongSucChua > 0 && form.guests > phongSucChua) {
      alert(`Thao tác thất bại: Phòng này chỉ chứa tối đa ${phongSucChua} người, đơn của bạn có ${form.guests} khách!`);
      return;
    }
    onSave({
      bookingType,
      customerId: String(form.customerId),
      customerName: selectedCustomer.name,
      roomId: String(selectedRoom.id),
      roomNumber: selectedRoom.roomNumber,
      checkIn: form.checkIn,
      checkOut: form.checkOut,
      guests: form.guests,
      amount: form.amount,
      status: form.status.trim() // Gửi chuỗi tiếng Việt sạch xuống page.tsx
    });
  };

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-gray-400 text-gray-800 transition duration-150 ease-in-out hover:border-gray-300";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-bold text-gray-900 text-xl flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
              {booking ? "Chỉnh sửa đặt phòng" : "Đặt phòng mới"}
            </h2>
            <p className="text-gray-400 text-xs mt-1">Nhập thông tin chi tiết và lưu thông tin đặt phòng</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition">
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm font-medium">Đang tải dữ liệu phòng và khách hàng...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* SECTION 1: CUSTOMER INFORMATION */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Thông tin khách hàng</h3>
                </div>

                {/* Searchable Combobox for selecting existing customers */}
                <div className="relative z-20 max-w-[240px] w-full">
                  <div className="flex items-center gap-1.5 border border-slate-200 rounded-xl px-2.5 py-1.5 bg-white text-xs text-slate-700 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition">
                    <input
                      type="text"
                      placeholder="Tìm khách hàng cũ (tên, SĐT...)"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsDropdownOpen(true);
                      }}
                      onFocus={() => setIsDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                      className="w-full bg-transparent focus:outline-none placeholder-slate-400 font-medium"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-slate-400 hover:text-slate-600 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-30 divide-y divide-slate-50 animate-fadeIn">
                      {filteredCustomers.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-400">
                          Không tìm thấy khách hàng
                        </div>
                      ) : (
                        filteredCustomers.map((c) => (
                          <button
                            key={c.id}
                            type="button"
                            onClick={() => {
                              handleSelectExistingCustomer(c.id);
                              setSearchQuery(""); // Clear search term after select
                              setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-3.5 py-2 hover:bg-slate-50 transition text-xs flex flex-col gap-0.5"
                          >
                            <span className="font-semibold text-slate-800">{c.name}</span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1.5">
                              <span>SĐT: {c.phone}</span>
                              {c.idCard && <span>• CCCD: {c.idCard}</span>}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Dynamic Auto-fill Notification Banner */}
              {isAutoFilled && form.customerId && (
                <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3.5 flex items-center justify-between shadow-sm animate-fadeIn">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <p className="text-emerald-800 text-xs font-semibold">
                        Khách hàng thành viên: {form.customerName}
                      </p>
                      <p className="text-emerald-600 text-[10px] mt-0.5">
                        Tự động hoàn tất thông tin từ Database (Mã KH: {form.customerId})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={resetCustomerForm}
                    className="text-xs text-emerald-700 hover:text-emerald-950 hover:underline font-semibold transition"
                  >
                    Xóa / Tạo mới
                  </button>
                </div>
              )}

              {/* Customer details fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên khách hàng</label>
                  <input
                    type="text"
                    value={form.customerName}
                    onChange={(e) => handleCustomerFieldChange("customerName", e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Giới tính</label>
                  <select
                    value={form.customerGender}
                    onChange={(e) => handleCustomerFieldChange("customerGender", e.target.value)}
                    className={inputClass}
                    required
                  >
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                  <input
                    type="tel"
                    value={form.customerPhone}
                    onChange={(e) => handleCustomerFieldChange("customerPhone", e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Nhập SĐT để tự hoàn tất..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.customerEmail}
                    onChange={(e) => handleCustomerFieldChange("customerEmail", e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Nhập Email để tự hoàn tất..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CCCD / Passport</label>
                  <input
                    type="text"
                    value={form.customerIdCard}
                    onChange={(e) => handleCustomerFieldChange("customerIdCard", e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Nhập CCCD để tự hoàn tất..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày sinh</label>
                  <input
                    type="date"
                    value={form.customerBirthday}
                    onChange={(e) => handleCustomerFieldChange("customerBirthday", e.target.value)}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ</label>
                  <input
                    type="text"
                    value={form.customerAddress}
                    onChange={(e) => handleCustomerFieldChange("customerAddress", e.target.value)}
                    className={inputClass}
                    required
                    placeholder="Hà Nội, Việt Nam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hạng khách hàng</label>
                  <select
                    value={form.customerStatus}
                    onChange={(e) => handleCustomerFieldChange("customerStatus", e.target.value)}
                    className={inputClass}
                  >
                    <option value="Thường">Thường</option>
                    <option value="VIP">VIP</option>
                    <option value="Khách hàng thân thiết">Khách hàng thân thiết</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: BOOKING INFORMATION */}
            <div className="bg-slate-50/70 border border-slate-100 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm tracking-wide uppercase">Chi tiết đặt phòng</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Chọn phòng trống</label>
                  <select
                    value={form.roomNumber}
                    onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                    className={inputClass}
                    required
                  >
                    <option value="">Chọn phòng</option>
                    {/* Include the current room if editing, plus all available rooms */}
                    {rooms
                      .filter((r) => r.status === "Trống" || r.roomNumber === booking?.roomNumber)
                      .map((r) => (
                        <option key={r.id} value={r.roomNumber}>
                          Phòng {r.roomNumber} — {r.type} ({r.pricePerNight.toLocaleString("vi-VN")} VND/đêm)
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái đặt</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
                    className={inputClass}
                  >
                    <option value="Đã đặt">Đã đặt</option>
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Đã trả phòng">Đã trả phòng</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày check-in</label>
                  <input
                    type="date"
                    value={form.checkIn}
                    onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày check-out</label>
                  <input
                    type="date"
                    value={form.checkOut}
                    onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* Guests and pricing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số lượng khách</label>
                  <input
                    type="number"
                    min={1}
                    value={form.guests}
                    onChange={(e) => setForm({ ...form, guests: parseInt(e.target.value) || 1 })}
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tổng tiền thanh toán</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        form.amount
                      )}
                      readOnly
                      className={`${inputClass} bg-slate-100 text-slate-500 cursor-not-allowed font-semibold`}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-slate-200 text-slate-600 py-3 rounded-xl text-sm font-semibold hover:bg-slate-50 transition duration-150 shadow-sm"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition duration-150 hover:shadow-blue-500/20 active:translate-y-[1px]"
              >
                {booking ? "Cập nhật đặt phòng" : "Hoàn tất đặt phòng"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}