"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ServiceUsage, ServiceUsageStatus } from "@/types/serviceUsage";
import { Booking } from "@/types/booking";
import { getAllBookings, getAllRooms, RoomResponse } from "@/lib/api/bookings";
import { getServices } from "@/lib/api/services";
import { Service } from "@/types/service";
import { mapBookingStatus } from "@/app/(dashboard)/bookings/page";
import { isNotEmpty, isPositiveInteger } from "@/lib/validation";

interface Props {
  usage: ServiceUsage | null;
  onSave: (data: ServiceUsage) => void;
  onClose: () => void;
}

const today = new Date().toISOString().split("T")[0];

const emptyForm: Omit<ServiceUsage, "id" | "usageCode"> = {
  bookingCode: "", customerName: "", roomNumber: "",
  serviceName: "", quantity: 1, unitPrice: 0,
  total: 0, date: today, status: "Chờ sử dụng",
};

export default function ServiceUsageModal({ usage, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<ServiceUsage, "id" | "usageCode" | "quantity"> & { quantity: number | "" }>({
    ...emptyForm,
    quantity: usage ? usage.quantity : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [rooms, setRooms] = useState<RoomResponse[]>([]);

  useEffect(() => {
    // Load Bookings
    getAllBookings()
      .then((data) => {
        const rawList = Array.isArray(data) ? data : [];
        const mapped = rawList.map((b: any) => ({
          id: b.id,
          bookingCode: String(b.id),
          customerName: b.customerName || "Khách vãng lai",
          roomNumber: b.roomNumber || "Chưa gán",
          checkIn: b.checkIn ? String(b.checkIn) : "",
          checkOut: b.checkOut ? String(b.checkOut) : "",
          bookingDate: b.bookingDate || "",
          status: mapBookingStatus(b.status),
          amount: b.thanhTien || b.tongTien || b.tongGia || b.amount || 0,
          guests: b.guests || b.soKhach || 1
        }));
        setBookings(mapped);
      })
      .catch((err) => console.error(err));

    // Load Services
    getServices()
      .then((data) => {
        setServices(data || []);
      })
      .catch((err) => console.error(err));

    // Load Rooms
    getAllRooms()
      .then((data) => {
        setRooms(data || []);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (usage) {
      const { id, usageCode, ...rest } = usage;
      setForm(rest);
    } else {
      setForm(emptyForm as any);
    }
    setErrors({});
  }, [usage]);

  // Tự điền thông tin khi chọn booking
  const handleBookingChange = (code: string) => {
    const booking = bookings.find((b) => b.bookingCode === code);
    setForm((prev) => ({
      ...prev,
      bookingCode: code,
      customerName: booking?.customerName ?? "",
      roomNumber: booking?.roomNumber ?? "",
    }));
    if (errors.bookingCode) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.bookingCode;
        return next;
      });
    }
  };

  // Tự điền giá khi chọn dịch vụ
  const handleServiceChange = (name: string) => {
    const service = services.find((s) => s.name === name);
    const unitPrice = service?.price ?? 0;
    const currentQty = form.quantity === "" ? 0 : form.quantity;
    setForm((prev) => ({
      ...prev,
      serviceName: name,
      unitPrice,
      total: unitPrice * currentQty,
    }));
    if (errors.serviceName) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.serviceName;
        return next;
      });
    }
  };

  // Tự tính total khi đổi số lượng
  const handleQuantityChange = (qty: number | "") => {
    const numericQty = qty === "" ? 0 : qty;
    setForm((prev) => ({ ...prev, quantity: qty, total: prev.unitPrice * numericQty }));
    if (errors.quantity) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.quantity;
        return next;
      });
    }
  };

  const handleChange = (field: keyof Omit<ServiceUsage, "id" | "usageCode">, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isNotEmpty(form.bookingCode)) newErrors.bookingCode = "Vui lòng chọn booking";
    if (!isNotEmpty(form.serviceName)) newErrors.serviceName = "Vui lòng chọn dịch vụ";
    if (!form.quantity || !isPositiveInteger(form.quantity)) {
      newErrors.quantity = "Số lượng phải lớn hơn hoặc bằng 1";
    }
    if (!isNotEmpty(form.date)) {
      newErrors.date = "Ngày sử dụng không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, quantity: form.quantity === "" ? 1 : form.quantity, id: usage?.id ?? 0, usageCode: usage?.usageCode ?? "" } as any);
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
    }
    return baseClass;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {usage ? "Chỉnh sửa bản ghi" : "Ghi nhận dịch vụ"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin sử dụng dịch vụ</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
            <select 
              value={form.bookingCode} 
              onChange={(e) => handleBookingChange(e.target.value)}
              className={getInputClass("bookingCode")}
            >
              <option value="">Chọn booking</option>
              {bookings
                .filter((b) => {
                  const isCurrent = b.bookingCode === form.bookingCode;
                  if (isCurrent) return true;

                  if (b.status !== "Đang sử dụng") return false;

                  const room = rooms.find((r) => String(r.id) === String(b.roomNumber));
                  return room?.trangThai === "Đang sử dụng";
                })
                .map((b) => (
                  <option key={b.id} value={b.bookingCode}>
                    {b.bookingCode} — {b.customerName} (Phòng {b.roomNumber})
                  </option>
                ))}
            </select>
            {errors.bookingCode && <p className="text-red-500 text-xs mt-1 font-medium">{errors.bookingCode}</p>}
          </div>

          {/* Khách hàng + Phòng (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
              <input type="text" value={form.customerName} readOnly
                className={getInputClass("customerName") + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <input type="text" value={form.roomNumber} readOnly
                className={getInputClass("roomNumber") + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
            <select 
              value={form.serviceName} 
              onChange={(e) => handleServiceChange(e.target.value)}
              className={getInputClass("serviceName")}
            >
              <option value="">Chọn dịch vụ</option>
              {services.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.price} VND)
                </option>
              ))}
            </select>
            {errors.serviceName && <p className="text-red-500 text-xs mt-1 font-medium">{errors.serviceName}</p>}
          </div>

          {/* Số lượng + Đơn giá + Tổng */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
              <input 
                type="number" 
                min={1} 
                value={form.quantity ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleQuantityChange(val === "" ? "" : parseInt(val, 10));
                }}
                className={getInputClass("quantity")} 
              />
              {errors.quantity && <p className="text-red-500 text-xs mt-1 font-medium">{errors.quantity}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VND)</label>
              <input type="number" value={form.unitPrice} readOnly
                className={getInputClass("unitPrice") + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng (VND)</label>
              <input type="number" value={form.total} readOnly
                className={getInputClass("total") + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
          </div>

          {/* Ngày + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
              <input 
                type="date" 
                value={form.date}
                onChange={(e) => handleChange("date", e.target.value)}
                className={getInputClass("date")} 
              />
              {errors.date && <p className="text-red-500 text-xs mt-1 font-medium">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select 
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as ServiceUsageStatus)}
                className={getInputClass("status")}
              >
                <option>Đã sử dụng</option>
                <option>Chờ sử dụng</option>
                <option>Đã hủy</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {usage ? "Lưu thay đổi" : "Ghi nhận"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}