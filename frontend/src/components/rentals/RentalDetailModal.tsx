"use client";

import { X, Calendar, User, UserCheck, Home, DollarSign, Users } from "lucide-react";
import { RentalSlip } from "@/lib/api/rentals";

interface Props {
  rental: RentalSlip;
  onClose: () => void;
}

export default function RentalDetailModal({ rental, onClose }: Props) {
  // Tính tổng số ngày lưu trú
  const calculateDays = (startStr: string, endStr: string) => {
    if (!startStr || !endStr) return 1;
    const start = new Date(startStr);
    const end = new Date(endStr);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1;
  };

  const days = calculateDays(rental.checkIn, rental.checkOut);
  const roomFeeTotal = rental.roomPrice * days;
  const serviceFeeTotal = rental.serviceUsages
    ? rental.serviceUsages.reduce((sum, u) => sum + u.total, 0)
    : 0;
  const grandTotal = roomFeeTotal + serviceFeeTotal;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              Chi tiết Phiếu thuê phòng
            </h2>
            <p className="text-blue-600 text-xs mt-0.5 font-bold uppercase tracking-wider">{rental.rentalCode}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center justify-between bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500">Trạng thái phiếu:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              rental.status === "Đang sử dụng" || rental.status === "Checked-in" || rental.status === "Đã nhận phòng tại quầy"
                ? "bg-green-50 text-green-700 border border-green-200"
                : rental.status === "Đã trả phòng" || rental.status === "Checked-out"
                ? "bg-gray-50 text-gray-500 border border-gray-200"
                : "bg-red-50 text-red-600 border border-red-200"
            }`}>
              {rental.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Khách hàng */}
            <div className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-slate-50/50 transition">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Khách hàng</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{rental.customerName}</p>
                <p className="text-xs text-gray-400 mt-1">ID khách: #{rental.customerId}</p>
              </div>
            </div>

            {/* Nhân viên phục vụ */}
            <div className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-slate-50/50 transition">
              <UserCheck className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Nhân viên tiếp đón</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{rental.employeeName}</p>
                <p className="text-xs text-gray-400 mt-1">Lập bởi NV: #{rental.employeeId || "Chưa có ID"}</p>
              </div>
            </div>

            {/* Phòng thuê */}
            <div className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-slate-50/50 transition">
              <Home className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Số Phòng thuê</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">Phòng {rental.roomNumber}</p>
                <p className="text-xs text-gray-400 mt-1">Đơn giá: {rental.roomPrice.toLocaleString()} VND/đêm</p>
              </div>
            </div>

            {/* Số khách */}
            <div className="flex items-start gap-3 p-3.5 border border-gray-100 rounded-xl hover:bg-slate-50/50 transition">
              <Users className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400 font-medium">Số lượng khách lưu trú</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">{rental.guests} người</p>
                <p className="text-xs text-gray-400 mt-1">Đơn đặt gốc: {rental.bookingCode ? `#${rental.bookingCode}` : "Thuê trực tiếp"}</p>
              </div>
            </div>
          </div>

          {/* Ngày lưu trú */}
          <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="font-semibold">Thời gian lưu trú ({days} ngày)</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-2.5 bg-white border border-gray-100 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Ngày nhận phòng</span>
                <span className="font-bold text-gray-700">{rental.checkIn}</span>
              </div>
              <div className="p-2.5 bg-white border border-gray-100 rounded-lg">
                <span className="text-gray-400 block mb-0.5">Ngày dự kiến trả</span>
                <span className="font-bold text-gray-700">{rental.checkOut}</span>
              </div>
            </div>
          </div>

          {/* Chi tiết tiền phòng */}
          <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 flex items-center justify-between text-sm">
            <span className="text-gray-500 font-medium">Tiền phòng ({days} ngày):</span>
            <span className="font-semibold text-gray-800">{roomFeeTotal.toLocaleString()} VND</span>
          </div>

          {/* Dịch vụ đã dùng */}
          {rental.serviceUsages && rental.serviceUsages.length > 0 && (
            <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 space-y-2">
              <span className="text-sm font-semibold text-gray-700 block mb-1">Dịch vụ đã sử dụng:</span>
              <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                {rental.serviceUsages.map((usage) => (
                  <div key={usage.id} className="flex justify-between items-center text-xs text-gray-600">
                    <span>{usage.serviceName} (SL: {usage.quantity}) - Ngày: {usage.date}</span>
                    <span className="font-medium">{usage.total.toLocaleString()} VND</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center text-xs text-gray-500">
                <span>Tổng tiền dịch vụ:</span>
                <span className="font-semibold text-gray-700">{serviceFeeTotal.toLocaleString()} VND</span>
              </div>
            </div>
          )}

          {/* Tổng tạm tính */}
          <div className="p-4 bg-blue-50/30 rounded-xl border border-blue-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-slate-800">Tổng tạm tính</p>
                <p className="text-xs text-gray-400">Tiền phòng + dịch vụ</p>
              </div>
            </div>
            <span className="text-lg font-bold text-blue-600">
              {grandTotal.toLocaleString()} VND
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end">
          <button onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
