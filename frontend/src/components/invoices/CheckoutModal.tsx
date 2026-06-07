"use client";

import { useState } from "react";
import { X, Banknote, CreditCard, ArrowLeftRight, CheckCircle2, LogOut } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { CheckoutRequest } from "@/lib/api/billing";

interface Props {
  maPhieuThue: number;
  maPhong: number;
  maNhanVien: number;
  khachHang?: string;
  onSuccess?: (invoiceData: any) => void;
  onClose: () => void;
}

interface CheckoutSummary {
  maHoaDon: number;
  tienPhong: number;
  tienDichVu: number;
  tienPhat: number;
  tongTien: number;
  chiTietHoaDon: Array<{ loaiChiPhi: string; thanhTien: number }>;
}

const PAYMENT_METHODS = [
  {
    value: "Tiền mặt",
    label: "Tiền mặt",
    icon: Banknote,
    desc: "Thanh toán tại quầy",
  },
  {
    value: "Thẻ",
    label: "Thẻ ngân hàng",
    icon: CreditCard,
    desc: "Visa, Mastercard, ATM",
  },
  {
    value: "Chuyển khoản",
    label: "Chuyển khoản",
    icon: ArrowLeftRight,
    desc: "Chuyển qua tài khoản",
  },
];

export default function CheckoutModal({
  maPhieuThue,
  maPhong,
  maNhanVien,
  khachHang,
  onSuccess,
  onClose,
}: Props) {
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [showError, setShowError] = useState<string | null>(null);
  const { performCheckout, loading, error, clearError } = useBilling();

  const handleCheckout = async () => {
    if (!selectedPaymentMethod) {
      setShowError("Vui lòng chọn phương thức thanh toán");
      return;
    }
    try {
      const request: CheckoutRequest = {
        maPhieuThue,
        maNhanVien,
        phuongThucThanhToan: selectedPaymentMethod,
      };
      const result = await performCheckout(request);
      if (result) {
        setCheckoutSummary(result);
        setShowError(null);
        onSuccess?.(result);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Lỗi không xác định";
      setShowError(errMsg);
    }
  };

  // --- Màn hình thành công ---
  if (checkoutSummary) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center gap-3 p-6 border-b bg-green-50 rounded-t-2xl">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-bold text-green-900">Trả phòng thành công!</h2>
          </div>

          <div className="p-6 space-y-4">
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-xs text-green-600 mb-0.5">Mã hóa đơn</p>
              <p className="text-2xl font-bold text-green-900">#{checkoutSummary.maHoaDon}</p>
            </div>

            <div className="space-y-2">
              {checkoutSummary.chiTietHoaDon.map((item, idx) => (
                <div key={idx} className="flex justify-between text-sm pb-2 border-b border-gray-100 last:border-0">
                  <span className="text-gray-600">{item.loaiChiPhi}</span>
                  <span className="font-semibold text-gray-800">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(item.thanhTien)}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex justify-between items-center">
              <span className="font-bold text-gray-800">Tổng cộng</span>
              <span className="text-xl font-bold text-blue-600">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(checkoutSummary.tongTien)}
              </span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl text-sm space-y-1 text-gray-600">
              <p>Khách hàng: <span className="font-semibold">{khachHang || "N/A"}</span></p>
              <p>Phòng: <span className="font-semibold">{maPhong}</span></p>
              <p>Phương thức: <span className="font-semibold text-green-700">{selectedPaymentMethod}</span></p>
              <p>Trạng thái: <span className="font-semibold text-green-700">Đã thanh toán</span></p>
            </div>
          </div>

          <div className="p-6 border-t rounded-b-2xl">
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium text-sm transition"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Màn hình chọn phương thức thanh toán ---
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-orange-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <LogOut className="w-5 h-5 text-orange-600" />
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trả phòng</h2>
              <p className="text-xs text-gray-500">Phiếu thuê #{maPhieuThue} · Khách: {khachHang || "N/A"}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Lỗi */}
          {(showError || error) && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between text-sm">
              <span>{showError || error}</span>
              <button onClick={() => { setShowError(null); clearError(); }}>
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Chọn phương thức thanh toán */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Chọn phương thức thanh toán</p>
            <div className="grid grid-cols-3 gap-3">
              {PAYMENT_METHODS.map((pm) => {
                const Icon = pm.icon;
                const isSelected = selectedPaymentMethod === pm.value;
                return (
                  <button
                    key={pm.value}
                    type="button"
                    onClick={() => { setSelectedPaymentMethod(pm.value); setShowError(null); }}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-center ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/40"
                    }`}
                  >
                    <Icon className={`w-6 h-6 ${isSelected ? "text-blue-600" : "text-gray-400"}`} />
                    <span className={`text-xs font-semibold ${isSelected ? "text-blue-700" : "text-gray-600"}`}>
                      {pm.label}
                    </span>
                    <span className="text-[10px] text-gray-400 leading-tight">{pm.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleCheckout}
            disabled={!selectedPaymentMethod || loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
              !selectedPaymentMethod || loading
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
            }`}
          >
            {loading ? "Đang xử lý..." : "Xác nhận trả phòng"}
          </button>
        </div>
      </div>
    </div>
  );
}
