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
  const [step, setStep] = useState<"confirm" | "verify">("confirm");
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    setStep("verify");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim() !== customer.name) {
      setError("Tên khách hàng không khớp. Vui lòng nhập lại.");
      return;
    }
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
                {step === "confirm" ? "Xác nhận xóa khách hàng" : "Xác thực danh tính"}
              </h2>
              <p className="text-gray-400 text-xs mt-0.5">Mã KH: {customer.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition" disabled={loading}>
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        {step === "confirm" ? (
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Bạn có chắc chắn muốn xóa khách hàng <strong className="text-gray-800 font-semibold">{customer.name}</strong> không?
            </p>
            <p className="text-xs text-red-500 bg-red-50 p-3 rounded-lg border border-red-100">
              Cảnh báo: Hành động này không thể hoàn tác. Các dữ liệu liên quan đến khách hàng này có thể bị ảnh hưởng.
            </p>
            
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-medium transition shadow-sm"
              >
                Xác nhận
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600 leading-relaxed">
                Để xác nhận, vui lòng nhập chính xác tên khách hàng dưới đây để tiếp tục:
              </p>
              <div className="p-2.5 bg-gray-50 rounded-lg text-center border border-gray-200 select-none">
                <span className="font-mono text-sm font-bold text-gray-800 tracking-wide">{customer.name}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="customer-name-confirm" className="block text-xs font-semibold text-gray-500">
                Nhập lại tên khách hàng
              </label>
              <input
                id="customer-name-confirm"
                type="text"
                autoFocus
                placeholder="Nhập đúng tên khách hàng..."
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (error) setError(null);
                }}
                disabled={loading}
                className="w-full px-3.5 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition"
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep("confirm")}
                disabled={loading}
                className="px-4 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm"
              >
                Quay lại
              </button>
              <button
                type="submit"
                disabled={inputText.trim() !== customer.name || loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-sm flex items-center gap-2"
              >
                {loading && <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                Xóa khách hàng
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
