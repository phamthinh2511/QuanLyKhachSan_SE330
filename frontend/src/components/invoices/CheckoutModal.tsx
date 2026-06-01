"use client";

import { useState, useEffect } from "react";
import { X, ShoppingCart, AlertCircle } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { CheckoutRequest } from "@/lib/api/billing";
import AddServiceModal from "./AddServiceModal";
import RecordInspectionModal from "./RecordInspectionModal";

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

export default function CheckoutModal({
  maPhieuThue,
  maPhong,
  maNhanVien,
  khachHang,
  onSuccess,
  onClose,
}: Props) {
  const [showAddService, setShowAddService] = useState(false);
  const [showInspection, setShowInspection] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [showError, setShowError] = useState<string | null>(null);
  const [hasPerformedInspection, setHasPerformedInspection] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { performCheckout, loading, error, clearError } = useBilling();

  // Thực hiện checkout
  const handleCheckout = async () => {
    if (!hasPerformedInspection) {
      setShowError("Vui lòng hoàn thành kiểm kê phòng trước khi checkout");
      return;
    }

    try {
      const request: CheckoutRequest = {
        maPhieuThue,
        maNhanVien,
      };
      const result = await performCheckout(request);
      if (result) {
        setCheckoutSummary(result);
        setShowError(null);
        onSuccess?.(result);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Lỗi checkout không xác định";
      setShowError(errMsg);
    }
  };

  const handleServiceAdded = () => {
    // Refresh để tải lại dữ liệu
    setRefreshKey((prev) => prev + 1);
  };

  const handleInspectionDone = () => {
    setHasPerformedInspection(true);
    setShowError(null);
  };

  // Nếu checkout thành công
  if (checkoutSummary) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b bg-green-50">
            <h2 className="text-xl font-bold text-green-900">✓ Checkout Thành Công</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Invoice number */}
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-sm text-green-600">Mã Hóa đơn</div>
              <div className="text-2xl font-bold text-green-900">
                #{checkoutSummary.maHoaDon}
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3">
              {checkoutSummary.chiTietHoaDon.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center pb-3 border-b"
                >
                  <span className="text-gray-700">{item.loaiChiPhi}</span>
                  <span className="font-semibold text-gray-900">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.thanhTien)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Tổng cộng:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(checkoutSummary.tongTien)}
                </span>
              </div>
            </div>

            {/* Payment info */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm">
              <p className="text-gray-600">
                Khách hàng: <span className="font-semibold">{khachHang || "N/A"}</span>
              </p>
              <p className="text-gray-600 mt-1">
                Phòng: <span className="font-semibold">{maPhong}</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {(showError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded flex items-start gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-medium">{showError || error}</div>
              <div className="text-sm mt-1">
                {!hasPerformedInspection
                  ? "Vui lòng hoàn thành kiểm kê phòng trước"
                  : "Kiểm tra lại thông tin và thử lại"}
              </div>
            </div>
            <button
              onClick={() => {
                setShowError(null);
                clearError();
              }}
              className="text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Booking info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Mã phiếu thuê:</div>
                <div className="font-semibold text-gray-900">{maPhieuThue}</div>
              </div>
              <div>
                <div className="text-gray-600">Mã phòng:</div>
                <div className="font-semibold text-gray-900">{maPhong}</div>
              </div>
              <div>
                <div className="text-gray-600">Khách hàng:</div>
                <div className="font-semibold text-gray-900">{khachHang || "N/A"}</div>
              </div>
              <div>
                <div className="text-gray-600">Nhân viên:</div>
                <div className="font-semibold text-gray-900">{maNhanVien}</div>
              </div>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Bước Checkout:</h3>

            {/* Step 1: Add services */}
            <div className="p-4 border border-gray-200 rounded-lg hover:bg-blue-50 transition">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Bước 1: Thêm Dịch vụ Phát sinh
                  </div>
                  <div className="text-sm text-gray-600">
                    (Nếu khách gọi thêm đồ ăn, giặt ủi, v.v.)
                  </div>
                </div>
                <button
                  onClick={() => setShowAddService(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                >
                  Thêm dịch vụ
                </button>
              </div>
            </div>

            {/* Step 2: Room inspection */}
            <div
              className={`p-4 border rounded-lg transition ${
                hasPerformedInspection
                  ? "border-green-300 bg-green-50"
                  : "border-gray-200 hover:bg-blue-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 flex items-center gap-2">
                    Bước 2: Kiểm kê Phòng
                    {hasPerformedInspection && (
                      <span className="text-green-600 text-sm">✓ Hoàn thành</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    (Kiểm tra hỏng hóc, mất đồ dùng, v.v.)
                  </div>
                </div>
                <button
                  onClick={() => setShowInspection(true)}
                  disabled={hasPerformedInspection}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    hasPerformedInspection
                      ? "bg-green-600 text-white"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {hasPerformedInspection ? "✓ Đã kiểm kê" : "Kiểm kê"}
                </button>
              </div>
            </div>

            {/* Step 3: Final checkout */}
            <div
              className={`p-4 border rounded-lg transition ${
                !hasPerformedInspection
                  ? "border-gray-200 bg-gray-50 opacity-50"
                  : "border-blue-200 bg-blue-50 hover:bg-blue-100"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">
                    Bước 3: Hoàn Tất Checkout
                  </div>
                  <div className="text-sm text-gray-600">
                    Xuất hóa đơn và kết thúc đơn thuê
                  </div>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={!hasPerformedInspection || loading}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    !hasPerformedInspection || loading
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  {loading ? "Đang xử lý..." : "Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Hủy
          </button>
        </div>
      </div>

      {/* Modals */}
      {showAddService && (
        <AddServiceModal
          key={refreshKey}
          maPhieuThue={maPhieuThue}
          maPhong={maPhong}
          onSuccess={handleServiceAdded}
          onClose={() => setShowAddService(false)}
        />
      )}
      {showInspection && (
        <RecordInspectionModal
          maPhieuThue={maPhieuThue}
          maPhong={maPhong}
          maNhanVien={maNhanVien}
          onSuccess={handleInspectionDone}
          onClose={() => setShowInspection(false)}
        />
      )}
    </div>
  );
}
