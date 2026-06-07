"use client";

import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { RecordInspectionRequest } from "@/lib/api/billing";
import { isNonNegativeNumber } from "@/lib/validation";

interface Props {
  maPhieuThue: number;
  maPhong: number;
  maNhanVien: number;
  onSuccess?: () => void;
  onClose: () => void;
}

export default function RecordInspectionModal({
  maPhieuThue,
  maPhong,
  maNhanVien,
  onSuccess,
  onClose,
}: Props) {
  const [tinhTrang, setTinhTrang] = useState("Phòng bình thường");
  const [tienBoiThuong, setTienBoiThuong] = useState<number | "">(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showError, setShowError] = useState<string | null>(null);
  const { recordInspection, loading, error, clearError } = useBilling();

  // Predefined inspection statuses
  const inspectionStatuses = [
    {
      value: "Phòng bình thường",
      label: "Phòng bình thường",
      color: "text-green-600",
    },
    {
      value: "Hỏng trang bị",
      label: "Hỏng trang bị",
      color: "text-orange-600",
    },
    {
      value: "Vết bẩn/Cần tổng vệ sinh",
      label: "Vết bẩn/Cần tổng vệ sinh",
      color: "text-orange-600",
    },
    {
      value: "Mất đồ dùng",
      label: "Mất đồ dùng",
      color: "text-red-600",
    },
    {
      value: "Hỏng nặng",
      label: "Hỏng nặng",
      color: "text-red-600",
    },
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!tinhTrang) {
      newErrors.tinhTrang = "Vui lòng chọn tình trạng phòng";
    }

    if (tienBoiThuong === "" || tienBoiThuong === undefined || tienBoiThuong === null || !isNonNegativeNumber(tienBoiThuong)) {
      newErrors.tienBoiThuong = "Tiền bồi thường không thể là số âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const request: RecordInspectionRequest = {
        maPhieuThue,
        maPhong,
        maNhanVien,
        tinhTrang,
        tienBoiThuong: tienBoiThuong === "" ? 0 : tienBoiThuong,
      };
      await recordInspection(request);
      setShowError(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Lỗi ghi nhận kiểm kê";
      setShowError(errMsg);
    }
  };

  const handleTienBoiThuongChange = (val: string) => {
    const parsed = val === "" ? "" : Math.max(0, parseInt(val, 10));
    setTienBoiThuong(parsed);
    if (errors.tienBoiThuong) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.tienBoiThuong;
        return next;
      });
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
    }
    return baseClass;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b bg-blue-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Kiểm kê Phòng Khi Trả</h2>
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded">
            {showError || error}
            <button
              onClick={() => {
                setShowError(null);
                clearError();
              }}
              className="float-right text-red-500 hover:text-red-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Thông tin chung */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <div className="text-gray-600">Mã phiếu thuê:</div>
                <div className="font-semibold text-gray-900">{maPhieuThue}</div>
              </div>
              <div>
                <div className="text-gray-600">Mã phòng:</div>
                <div className="font-semibold text-gray-900">{maPhong}</div>
              </div>
              <div>
                <div className="text-gray-600">Nhân viên kiểm kê:</div>
                <div className="font-semibold text-gray-900">{maNhanVien}</div>
              </div>
            </div>
          </div>

          {/* Tình trạng phòng */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Tình trạng phòng:
            </label>
            <div className="space-y-2">
              {inspectionStatuses.map((status) => (
                <label
                  key={status.value}
                  className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50"
                >
                  <input
                    type="radio"
                    name="tinhTrang"
                    value={status.value}
                    checked={tinhTrang === status.value}
                    onChange={(e) => {
                      setTinhTrang(e.target.value);
                      if (errors.tinhTrang) {
                        setErrors((prev) => {
                          const next = { ...prev };
                          delete next.tinhTrang;
                          return next;
                        });
                      }
                    }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className={`ml-3 font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </label>
              ))}
            </div>
            {errors.tinhTrang && <p className="text-red-500 text-xs mt-1 font-medium">{errors.tinhTrang}</p>}
          </div>

          {/* Tiền bồi thường */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tiền bồi thường (nếu có hỏng hóc):
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-gray-600 font-medium">
                ₫
              </span>
              <input
                type="number"
                value={tienBoiThuong ?? ""}
                onChange={(e) => handleTienBoiThuongChange(e.target.value)}
                className={getInputClass("tienBoiThuong")}
                placeholder="0"
              />
            </div>
            {errors.tienBoiThuong && <p className="text-red-500 text-xs mt-1 font-medium">{errors.tienBoiThuong}</p>}
            <p className="text-xs text-gray-500 mt-2">
              Nhập số tiền cần bồi thường nếu khách làm hỏng đồ dùng phòng
            </p>
          </div>

          {/* Tóm tắt */}
          {tienBoiThuong !== "" && tienBoiThuong > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">
                  Tổng tiền bồi thường:
                </span>
                <span className="text-lg font-bold text-orange-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    minimumFractionDigits: 0,
                  }).format(tienBoiThuong as number)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 font-medium"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {loading ? "Đang ghi nhận..." : "Xác nhận kiểm kê"}
          </button>
        </div>
      </div>
    </div>
  );
}
