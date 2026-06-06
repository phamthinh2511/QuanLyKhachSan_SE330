"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { Customer } from "@/types/customer";

interface Props {
  customer: Customer;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function CustomerDeleteModal({ customer, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi xóa");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 text-base">
                Xác nhận chuyển vào Thùng rác
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">Mã KH: {customer.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition" disabled={loading}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            Bạn có chắc chắn muốn chuyển khách hàng <strong className="text-gray-800 font-semibold">{customer.name}</strong> vào Thùng rác không?
          </p>
          <p className="text-xs text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
            Thông tin: Khách hàng sẽ tạm thời bị xóa khỏi danh sách hoạt động. Bạn có thể khôi phục lại thông tin khách hàng từ Thùng rác trong phần Cài đặt bất cứ lúc nào.
          </p>
          
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
            >
              {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
              Xác nhận xóa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
