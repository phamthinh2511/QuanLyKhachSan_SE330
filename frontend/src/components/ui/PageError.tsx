import React from "react";
import { AlertTriangle } from "lucide-react";

interface PageErrorProps {
  message: string | null;
  onRetry?: () => void;
}

export default function PageError({ message, onRetry }: PageErrorProps) {
  const handleRetry = () => {
    if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px]">
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md w-full shadow-sm text-center space-y-5 flex flex-col items-center">
        <div className="p-3 bg-red-50 rounded-2xl text-red-500">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-gray-800">Không thể tải dữ liệu</h3>
          <p className="text-gray-500 text-sm leading-relaxed break-words max-w-xs mx-auto">
            {message || "Đã xảy ra lỗi kết nối với máy chủ API. Vui lòng kiểm tra đường truyền và thử lại."}
          </p>
        </div>
        <button
          onClick={handleRetry}
          className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-semibold rounded-xl transition shadow-sm"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
}
