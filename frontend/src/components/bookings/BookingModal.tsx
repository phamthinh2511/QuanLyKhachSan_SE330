
"use client";

import { useState, useEffect } from "react";
import { X, User, CalendarDays, Sparkles, Check } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";
import { getCustomers, createCustomer } from "@/lib/api/customers";
import { getRooms } from "@/lib/api/rooms";
import { Customer } from "@/types/customer";
import { Room } from "@/types/room";
import { isNotEmpty, isValidEmail, isValidPhone, isValidIdCard, isPastDate, isPositiveInteger } from "@/lib/validation";

interface Props {
  booking: Booking | null;
  bookings?: Booking[];
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
  guests: number | "";
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
  status: "Đặt trước",
};

export default function BookingModal({ booking, bookings = [], onSave, onClose }: Props) {
  const [form, setForm] = useState<ExtendedForm>(emptyForm);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Đồng bộ chuỗi chặn ngày quá khứ theo mốc thời gian thực tại của hệ thống (Năm 2026)
  const todayStr = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .split("T")[0];

  const filteredCustomers = searchQuery.trim() === ""
    ? customers
    : customers.filter((c) =>
        (c.name && c.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (c.phone && c.phone.includes(searchQuery)) ||
        (c.idCard && c.idCard.includes(searchQuery)) ||
        (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase()))
      );

  // Tải dữ liệu phòng và khách hàng
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

  // Điền dữ liệu vào form khi ở chế độ chỉnh sửa
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
        status: booking.status || "Đặt trước",
      });
      if (cust) {
        setIsAutoFilled(true);
      }
    } else {
      setForm(emptyForm);
      setIsAutoFilled(false);
    }
    setFieldErrors({});
  }, [booking, customers]);

  // Tự động tính toán tổng tiền dựa vào số đêm phòng
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

  const handleCustomerFieldChange = (field: keyof ExtendedForm, value: string) => {
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
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

  const handleCheckInChange = (val: string) => {
      if (fieldErrors.ngayNhan) {
        setFieldErrors((prev) => {
          const c = { ...prev };
          delete c.ngayNhan;
          return c;
        });
      }
      if (!val) {
        setForm((prev) => ({ ...prev, checkIn: val }));
        return;
      }

      setForm((prev) => {
        // ✅ Nếu có ngày Check-out cũ và ngày Check-out đó vẫn lớn hơn Check-in mới, giữ nguyên lịch Check-out
        if (prev.checkOut && prev.checkOut > val) {
          return {
            ...prev,
            checkIn: val,
          };
        }

        // Ngược lại, tự động tăng thêm 1 ngày cho ngày check-out
        const checkInDate = new Date(val);
        const nextDay = new Date(checkInDate);
        nextDay.setDate(checkInDate.getDate() + 1);

    const offset = nextDay.getTimezoneOffset();
    const localNextDay = new Date(nextDay.getTime() - offset * 60 * 1000);
    const checkOutStr = localNextDay.toISOString().split("T")[0];

        return {
          ...prev,
          checkIn: val,
          checkOut: checkOutStr,
        };
      });
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

  const isRoomAvailable = (roomNumber: string) => {
    if (!form.checkIn || !form.checkOut) {
      return true;
    }
    const formIn = new Date(form.checkIn);
    const formOut = new Date(form.checkOut);
    if (isNaN(formIn.getTime()) || isNaN(formOut.getTime()) || formIn >= formOut) {
      return false;
    }

    return !bookings.some((b) => {
      if (b.roomNumber !== roomNumber) return false;
      if (b.status === "Đã hủy" ||
                b.status === "Đã trả phòng" ||
                b.status === "Đã nhận phòng" ||
                b.status === "Đã nhận phòng tại quầy") return false;
      if (booking && b.id === booking.id) return false;

      const bIn = new Date(b.checkIn);
      const bOut = new Date(b.checkOut);
      if (isNaN(bIn.getTime()) || isNaN(bOut.getTime())) return false;

      return formIn < bOut && formOut > bIn;
    });
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isAutoFilled && !form.customerId) {
      if (!isNotEmpty(form.customerName)) {
        newErrors.customerName = "Tên khách hàng không được để trống";
      }
      if (!isNotEmpty(form.customerPhone)) {
        newErrors.customerPhone = "Số điện thoại không được để trống";
      } else if (!isValidPhone(form.customerPhone)) {
        newErrors.customerPhone = "Số điện thoại không hợp lệ (9-11 chữ số, bắt đầu bằng 0 hoặc +84)";
      }
      if (!isNotEmpty(form.customerEmail)) {
        newErrors.customerEmail = "Email không được để trống";
      } else if (!isValidEmail(form.customerEmail)) {
        newErrors.customerEmail = "Email không đúng định dạng";
      }
      if (!isNotEmpty(form.customerIdCard)) {
        newErrors.customerIdCard = "CCCD không được để trống";
      } else if (!isValidIdCard(form.customerIdCard)) {
        newErrors.customerIdCard = "CCCD phải gồm 9 hoặc 12 chữ số";
      }
      if (!isNotEmpty(form.customerBirthday)) {
        newErrors.customerBirthday = "Ngày sinh không được để trống";
      } else if (!isPastDate(form.customerBirthday)) {
        newErrors.customerBirthday = "Ngày sinh phải là ngày trong quá khứ";
      }
      if (!isNotEmpty(form.customerAddress)) {
        newErrors.customerAddress = "Địa chỉ không được để trống";
      }
    }

    if (!isNotEmpty(form.roomNumber)) {
      newErrors.maPhongId = "Vui lòng chọn phòng";
    } else {
      const selectedRoom = rooms.find((r) => r.roomNumber === form.roomNumber);
      if (selectedRoom) {
        const capacity = selectedRoom.capacity || 0;
        if (capacity > 0 && form.guests !== "" && form.guests > capacity) {
          newErrors.soKhach = `Phòng này chỉ chứa tối đa ${capacity} người`;
        }
      }
    }

    if (!isNotEmpty(form.checkIn)) {
      newErrors.ngayNhan = "Vui lòng chọn ngày check-in";
    }
    if (!isNotEmpty(form.checkOut)) {
      newErrors.ngayTra = "Vui lòng chọn ngày check-out";
    } else if (form.checkIn && new Date(form.checkOut) <= new Date(form.checkIn)) {
      newErrors.ngayTra = "Ngày check-out phải sau ngày check-in";
    }

    if (!form.guests || !isPositiveInteger(form.guests)) {
      newErrors.soKhach = "Số lượng khách phải lớn hơn hoặc bằng 1";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const bookingType = form.status === "Đang sử dụng" ? "THUE_TRUC_TIEP" : "DAT_TRUOC";
    const selectedRoom = rooms.find((r) => r.roomNumber === form.roomNumber);

    if (!selectedRoom) return;

    let customerId = form.customerId;
    let customerName = form.customerName;

    if (!customerId) {
      try {
        const newCustomer = await createCustomer({
          name: form.customerName,
          phone: form.customerPhone,
          gender: form.customerGender,
          birthday: form.customerBirthday,
          address: form.customerAddress,
          email: form.customerEmail,
          idCard: form.customerIdCard,
          status: form.customerStatus as any,
        });
        customerId = newCustomer.id;
        customerName = newCustomer.name;
      } catch (err: any) {
        if (err && err.isApiError && err.result) {
          setFieldErrors(err.result);
          const firstErr = Object.keys(err.result)[0];
          document.getElementById(firstErr)?.focus();
        } else {
          alert("Lỗi khi thêm mới khách hàng: " + (err.message || err));
        }
        return;
      }
    }

    try {
      await onSave({
        id: booking ? booking.id : null,
        bookingType,
        customerId: String(customerId),
        customerName: customerName,
        roomId: String(selectedRoom.id),
        roomNumber: selectedRoom.roomNumber,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        guests: form.guests === "" ? 1 : form.guests,
        ngayNhan: form.checkIn,
        ngayTra: form.checkOut,
        amount: form.amount,
        roomPrice: selectedRoom.pricePerNight,
        status: form.status.trim()
      });
    } catch (err: any) {
      console.log("Modal nhận diện lỗi từ Page truyền xuống:", err);
      if (err && err.isApiError && err.status === 422 && err.result) {
        setFieldErrors(err.result);
        const firstErrorField = Object.keys(err.result)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) {
          errorElement.focus();
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      } else {
        alert(err.message || "Đã xảy ra lỗi trong quá trình xử lý đơn phòng.");
      }
    }
  };

  const getInputStyle = (fieldName: string) => {
    const baseClass = "w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 bg-white placeholder-gray-400 text-gray-800 transition duration-150 ease-in-out";
    if (fieldErrors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
    }
    return `${baseClass} border-gray-200 focus:ring-blue-500 hover:border-gray-300`;
  };

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
                    <div className="absolute right-0 top-full mt-1.5 w-64 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto z-30 divide-y divide-slate-50">
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
                              setSearchQuery("");
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

              {isAutoFilled && form.customerId && (
                <div className="bg-emerald-50 border border-emerald-200/60 rounded-xl p-3.5 flex items-center justify-between shadow-sm">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Tên khách hàng</label>
                  <input
                    type="text"
                    id="customerName"
                    value={form.customerName}
                    onChange={(e) => handleCustomerFieldChange("customerName", e.target.value)}
                    className={getInputStyle("customerName")}
                    required
                    placeholder="Nguyễn Văn A"
                  />
                  {fieldErrors.customerName && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.customerName}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Giới tính</label>
                  <select
                    id="customerGender"
                    value={form.customerGender}
                    onChange={(e) => handleCustomerFieldChange("customerGender", e.target.value)}
                    className={getInputStyle("customerGender")}
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
                    id="customerPhone"
                    value={form.customerPhone}
                    onChange={(e) => handleCustomerFieldChange("customerPhone", e.target.value)}
                    className={getInputStyle("customerPhone")}
                    required
                    placeholder="Nhập SĐT để tự hoàn tất..."
                  />
                  {fieldErrors.customerPhone && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.customerPhone}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    value={form.customerEmail}
                    onChange={(e) => handleCustomerFieldChange("customerEmail", e.target.value)}
                    className={getInputStyle("customerEmail")}
                    required
                    placeholder="Nhập Email để tự hoàn tất..."
                  />
                  {fieldErrors.customerEmail && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.customerEmail}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">CCCD / Passport</label>
                  <input
                    type="text"
                    id="customerIdCard"
                    value={form.customerIdCard}
                    onChange={(e) => handleCustomerFieldChange("customerIdCard", e.target.value)}
                    className={getInputStyle("customerIdCard")}
                    required
                    placeholder="Nhập CCCD để tự hoàn tất..."
                  />
                  {fieldErrors.customerIdCard && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.customerIdCard}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày sinh</label>
                  <input
                    type="date"
                    id="customerBirthday"
                    value={form.customerBirthday}
                    onChange={(e) => handleCustomerFieldChange("customerBirthday", e.target.value)}
                    className={getInputStyle("customerBirthday")}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Địa chỉ</label>
                  <input
                    type="text"
                    id="customerAddress"
                    value={form.customerAddress}
                    onChange={(e) => handleCustomerFieldChange("customerAddress", e.target.value)}
                    className={getInputStyle("customerAddress")}
                    required
                    placeholder="Hà Nội, Việt Nam"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Hạng khách hàng</label>
                  <select
                    id="customerStatus"
                    value={form.customerStatus}
                    onChange={(e) => handleCustomerFieldChange("customerStatus", e.target.value)}
                    className={getInputStyle("customerStatus")}
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
                    id="maPhongId"
                    value={form.roomNumber}
                    onChange={(e) => {
                      setForm({ ...form, roomNumber: e.target.value });
                      if (fieldErrors.maPhongId) setFieldErrors(p => { const c = { ...p }; delete c.maPhongId; return c; });
                    }}
                    className={getInputStyle("maPhongId")}
                    required
                  >
                    <option value="">Chọn phòng</option>
                    {rooms
                        .filter((r) => {
                          // 1. Loại bỏ các phòng đang bảo trì
                          if (r.status === "Bảo trì") return false;

                          // 2. Nếu là phòng đang sửa của chính đơn này thì luôn hiển thị
                          if (booking && r.roomNumber === booking.roomNumber) return true;

                          // 3. Nếu người dùng chọn trạng thái tạo mới là "Đặt trước", kiểm tra lịch trùng
                          return isRoomAvailable(r.roomNumber);
                        })
                      .map((r) => (
                        <option key={r.id} value={r.roomNumber}>
                          Phòng {r.roomNumber} — {r.type} ({r.pricePerNight.toLocaleString("vi-VN")} VND/đêm)
                        </option>
                      ))}
                  </select>
                  {fieldErrors.maPhongId && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.maPhongId}</span>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Trạng thái đặt</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
                    className={getInputStyle("trangThai")}
                  >
                    <option value="Đặt trước">Đặt trước</option>
                    <option value="Đang sử dụng">Đang sử dụng</option>
                    <option value="Đã hủy">Đã hủy</option>
                  </select>
                </div>
              </div>

              {/* Dates Validation UI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày check-in</label>
                  <input
                    type="date"
                    id="ngayNhan"
                    min={todayStr}
                    value={form.checkIn}
                    onChange={(e) => handleCheckInChange(e.target.value)}
                    className={getInputStyle("ngayNhan")}
                    required
                  />
                  {fieldErrors.ngayNhan && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.ngayNhan}</span>}
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ngày check-out</label>
                  <input
                    type="date"
                    id="ngayTra"
                    min={
                                          form.checkIn
                                            ? (() => {
                                                const nextDay = new Date(form.checkIn);
                                                nextDay.setDate(nextDay.getDate() + 1);
                                                const offset = nextDay.getTimezoneOffset();
                                                const localNextDay = new Date(nextDay.getTime() - offset * 60 * 1000);
                                                return localNextDay.toISOString().split("T")[0];
                                              })()
                                            : todayStr
                                        }
                    value={form.checkOut}
                    onChange={(e) => {
                      setForm({ ...form, checkOut: e.target.value });
                      if (fieldErrors.ngayTra) setFieldErrors(p => { const c = { ...p }; delete c.ngayTra; return c; });
                    }}
                    className={getInputStyle("ngayTra")}
                    required
                  />
                  {fieldErrors.ngayTra && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.ngayTra}</span>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Số lượng khách</label>
                  <input
                    type="number"
                    id="soKhach"
                    min={1}
                    value={form.guests ?? ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, guests: val === "" ? "" : parseInt(val, 10) });
                      if (fieldErrors.soKhach) setFieldErrors(p => { const c = { ...p }; delete c.soKhach; return c; });
                    }}
                    className={getInputStyle("soKhach")}
                    required
                  />
                  {fieldErrors.soKhach && <span className="text-xs text-red-500 font-medium mt-1 block">{fieldErrors.soKhach}</span>}
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
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-slate-100 text-slate-500 cursor-not-allowed font-semibold transition duration-150 ease-in-out"
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/10 transition duration-150"
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