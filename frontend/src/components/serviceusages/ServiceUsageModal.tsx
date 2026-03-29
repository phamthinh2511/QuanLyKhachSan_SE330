"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { ServiceUsage, ServiceUsageStatus } from "@/types/serviceUsage";
import { mockBookings } from "@/lib/data/bookings";
import { mockServices } from "@/lib/data/services";

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
  const [form, setForm] = useState<Omit<ServiceUsage, "id" | "usageCode">>(emptyForm);

  useEffect(() => {
    if (usage) {
      const { id, usageCode, ...rest } = usage;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [usage]);

  // Tự điền thông tin khi chọn booking
  const handleBookingChange = (code: string) => {
    const booking = mockBookings.find((b) => b.bookingCode === code);
    setForm((prev) => ({
      ...prev,
      bookingCode: code,
      customerName: booking?.customerName ?? "",
      roomNumber: booking?.roomNumber ?? "",
    }));
  };

  // Tự điền giá khi chọn dịch vụ
  const handleServiceChange = (name: string) => {
    const service = mockServices.find((s) => s.name === name);
    const unitPrice = service?.price ?? 0;
    setForm((prev) => ({
      ...prev,
      serviceName: name,
      unitPrice,
      total: unitPrice * prev.quantity,
    }));
  };

  // Tự tính total khi đổi số lượng
  const handleQuantityChange = (qty: number) => {
    setForm((prev) => ({ ...prev, quantity: qty, total: prev.unitPrice * qty }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: usage?.id ?? 0, usageCode: usage?.usageCode ?? "" });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Booking</label>
            <select value={form.bookingCode} onChange={(e) => handleBookingChange(e.target.value)}
              className={inputClass} required>
              <option value="">Chọn booking</option>
              {mockBookings.map((b) => (
                <option key={b.id} value={b.bookingCode}>
                  {b.bookingCode} — {b.customerName} (Phòng {b.roomNumber})
                </option>
              ))}
            </select>
          </div>

          {/* Khách hàng + Phòng (readonly) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Khách hàng</label>
              <input type="text" value={form.customerName} readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng</label>
              <input type="text" value={form.roomNumber} readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
          </div>

          {/* Dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dịch vụ</label>
            <select value={form.serviceName} onChange={(e) => handleServiceChange(e.target.value)}
              className={inputClass} required>
              <option value="">Chọn dịch vụ</option>
              {mockServices.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} (${s.price})
                </option>
              ))}
            </select>
          </div>

          {/* Số lượng + Đơn giá + Tổng */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số lượng</label>
              <input type="number" min={1} value={form.quantity}
                onChange={(e) => handleQuantityChange(+e.target.value)}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VND)</label>
              <input type="number" value={form.unitPrice} readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng (VND)</label>
              <input type="number" value={form.total} readOnly
                className={inputClass + " bg-gray-50 text-gray-500 cursor-not-allowed"} />
            </div>
          </div>

          {/* Ngày + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày</label>
              <input type="date" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ServiceUsageStatus })}
                className={inputClass}>
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