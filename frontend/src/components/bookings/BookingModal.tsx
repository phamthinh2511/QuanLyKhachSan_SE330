"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Booking, BookingStatus } from "@/types/booking";
import { mockCustomers } from "@/lib/data/customers";
import { mockRooms } from "@/lib/data/rooms";

interface Props {
  booking: Booking | null;
  onSave: (data: Booking) => void;
  onClose: () => void;
}

const emptyForm: Omit<Booking, "id" | "bookingCode"> = {
  customerName: "", roomNumber: "", checkIn: "", checkOut: "",
  guests: 1, amount: 0, status: "Đã đặt",
};

export default function BookingModal({ booking, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Booking, "id" | "bookingCode">>(emptyForm);

  useEffect(() => {
    if (booking) {
      const { id, bookingCode, ...rest } = booking;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [booking]);

  // Tự tính amount khi chọn phòng + ngày
  useEffect(() => {
    if (!form.roomNumber || !form.checkIn || !form.checkOut) return;
    const room = mockRooms.find((r) => r.roomNumber === form.roomNumber);
    if (!room) return;
    const nights = Math.max(
      0,
      (new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / 86400000
    );
    setForm((prev) => ({ ...prev, amount: room.pricePerNight * nights }));
  }, [form.roomNumber, form.checkIn, form.checkOut]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: booking?.id ?? 0, bookingCode: booking?.bookingCode ?? "" });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {booking ? "Chỉnh sửa booking" : "Đặt phòng mới"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin đặt phòng bên dưới</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Khách hàng + Phòng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
              <select value={form.customerName}
                onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                className={inputClass} required>
                <option value="">Chọn khách hàng</option>
                {mockCustomers.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <select value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className={inputClass} required>
                <option value="">Chọn phòng</option>
                {mockRooms.filter((r) => r.status === "Trống").map((r) => (
                  <option key={r.id} value={r.roomNumber}>
                    {r.roomNumber} — {r.type} (${r.pricePerNight}/đêm)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Check-in + Check-out */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-in</label>
              <input type="date" value={form.checkIn}
                onChange={(e) => setForm({ ...form, checkIn: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày check-out</label>
              <input type="date" value={form.checkOut}
                onChange={(e) => setForm({ ...form, checkOut: e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          {/* Số khách + Tổng tiền */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số khách</label>
              <input type="number" min={1} value={form.guests}
                onChange={(e) => setForm({ ...form, guests: +e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tiền (VND)</label>
              <input type="number" value={form.amount} readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BookingStatus })}
              className={inputClass}>
              <option>Booked</option>
              <option>Checked-in</option>
              <option>Checked-out</option>
              <option>Cancelled</option>
            </select>
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