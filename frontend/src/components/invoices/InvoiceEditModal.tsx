"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Invoice, PaymentMethod, InvoiceStatus } from "@/types/invoice";

interface Props {
  invoice: Invoice;
  onSave: (data: Invoice) => void;
  onClose: () => void;
}

export default function InvoiceEditModal({ invoice, onSave, onClose }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(invoice.paymentMethod || "Tiền mặt");
  const [status, setStatus] = useState<InvoiceStatus>(invoice.status || "Chờ thanh toán");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...invoice,
      paymentMethod,
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Chỉnh sửa hóa đơn</h2>
            <p className="text-gray-400 text-xs mt-0.5">Mã HĐ: {invoice.invoiceCode}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            {/* Khách hàng (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Khách hàng</label>
              <input type="text" value={invoice.customerName} disabled className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
            </div>
            {/* Phòng (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Phòng</label>
              <input type="text" value={invoice.roomNumber} disabled className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Tiền phòng (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tiền phòng (VND)</label>
              <input
                type="text"
                value={invoice.roomCost.toLocaleString()}
                disabled
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed font-semibold"
              />
            </div>
            {/* Tiền dịch vụ (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Tiền dịch vụ (VND)</label>
              <input
                type="text"
                value={invoice.serviceCost.toLocaleString()}
                disabled
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm text-gray-500 cursor-not-allowed font-semibold"
              />
            </div>
          </div>

          {/* Phương thức thanh toán & Trạng thái — Mở cho phép chỉnh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Thanh toán</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150"
              >
                <option value="Tiền mặt">Tiền mặt</option>
                <option value="Thẻ">Thẻ ngân hàng</option>
                <option value="Chuyển khoản">Chuyển khoản</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150"
              >
                <option value="Chờ thanh toán">Chờ thanh toán</option>
                <option value="Đã thanh toán">Đã thanh toán</option>
              </select>
            </div>
          </div>

          {/* Tổng cộng */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center text-sm">
            <span className="font-semibold text-gray-600">Tổng cộng (Tự động):</span>
            <span className="font-bold text-blue-600 text-base">{invoice.total.toLocaleString()} VND</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
