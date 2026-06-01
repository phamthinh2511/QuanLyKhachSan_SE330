"use client";

import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { useBilling } from "@/hooks/useBilling";
import { getServices } from "@/lib/api/services";
import { Service } from "@/types/service";
import { AddServiceRequest } from "@/lib/api/billing";

interface Props {
  maPhieuThue: number;
  maPhong: number;
  onSuccess?: () => void;
  onClose: () => void;
}

interface ServiceWithQuantity extends Service {
  soLuong: number;
}

export default function AddServiceModal({
  maPhieuThue,
  maPhong,
  onSuccess,
  onClose,
}: Props) {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServices, setSelectedServices] = useState<ServiceWithQuantity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);
  const { addService, loading, error, clearError } = useBilling();

  // Load danh sách dịch vụ
  useEffect(() => {
    getServices()
      .then(setServices)
      .catch((err) => {
        console.error("Lỗi tải dịch vụ:", err);
        setShowError("Không thể tải danh sách dịch vụ");
      });
  }, []);

  // Add service to selected list
  const handleSelectService = (service: Service) => {
    const existing = selectedServices.find((s) => s.id === service.id);
    if (existing) {
      setSelectedServices(
        selectedServices.map((s) =>
          s.id === service.id ? { ...s, soLuong: s.soLuong + 1 } : s
        )
      );
    } else {
      setSelectedServices([
        ...selectedServices,
        { ...service, soLuong: 1 },
      ]);
    }
  };

  // Update quantity
  const handleQuantityChange = (serviceId: number, quantity: number) => {
    if (quantity <= 0) {
      setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
    } else {
      setSelectedServices(
        selectedServices.map((s) =>
          s.id === serviceId ? { ...s, soLuong: quantity } : s
        )
      );
    }
  };

  // Remove service from selected list
  const handleRemoveService = (serviceId: number) => {
    setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
  };

  // Submit all selected services
  const handleSubmit = async () => {
    if (selectedServices.length === 0) {
      setShowError("Vui lòng chọn ít nhất một dịch vụ");
      return;
    }

    setIsLoading(true);
    try {
      for (const service of selectedServices) {
        const request: AddServiceRequest = {
          maPhieuThue,
          maDichVu: service.id,
          maPhong,
          soLuong: service.soLuong,
          donGia: service.price,
        };
        await addService(request);
      }
      
      setShowError(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Lỗi thêm dịch vụ";
      setShowError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = selectedServices.reduce(
    (sum, s) => sum + s.price * s.soLuong,
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Thêm Dịch vụ Phát sinh</h2>
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

        <div className="p-6">
          {/* Available services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Danh sách dịch vụ có sẵn:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleSelectService(service)}
                  className="text-left p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                >
                  <div className="font-medium text-gray-900">
                    {service.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {service.description}
                  </div>
                  <div className="text-sm font-semibold text-blue-600 mt-1">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(service.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected services */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Dịch vụ đã chọn:
            </h3>
            {selectedServices.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        {service.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Giá: {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(service.price)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        value={service.soLuong}
                        onChange={(e) =>
                          handleQuantityChange(
                            service.id,
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-16 px-2 py-1 border rounded text-center"
                      />
                      <div className="w-24 text-right text-sm font-semibold text-blue-600">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(service.price * service.soLuong)}
                      </div>
                      <button
                        onClick={() => handleRemoveService(service.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Chưa chọn dịch vụ nào</p>
            )}
          </div>

          {/* Total */}
          {selectedServices.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-900">Tổng tiền:</span>
                <span className="text-xl font-bold text-blue-600">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(totalAmount)}
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
            disabled={isLoading || loading || selectedServices.length === 0}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {isLoading || loading ? "Đang thêm..." : "Thêm dịch vụ"}
          </button>
        </div>
      </div>
    </div>
  );
}
