"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Service } from "@/types/service";
import { isNotEmpty, isNonNegativeNumber } from "@/lib/validation";

interface Props {
  service: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
}

const emptyForm: Omit<Service, "id" | "serviceCode"> = {
  name: "", price: 0, description: "",
};

export default function ServiceModal({ service, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Service, "id" | "serviceCode" | "price"> & { price: number | "" }>({
    ...emptyForm,
    price: service ? service.price : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service) {
      const { id, serviceCode, ...rest } = service;
      setForm(rest);
    } else {
      setForm(emptyForm as any);
    }
    setErrors({});
  }, [service]);

  const handleChange = (field: keyof Omit<Service, "id" | "serviceCode">, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isNotEmpty(form.name)) newErrors.name = "Tên dịch vụ không được để trống";
    if (form.price === "" || form.price === undefined || form.price === null || !isNonNegativeNumber(form.price)) {
      newErrors.price = "Giá dịch vụ phải là số không âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, price: form.price === "" ? 0 : form.price, id: service?.id ?? 0, serviceCode: service?.serviceCode ?? "" } as any);
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
    }
    return baseClass;
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {service ? "Chỉnh sửa dịch vụ" : "Thêm dịch vụ mới"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin dịch vụ bên dưới</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Tên dịch vụ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
            <input
              type="text"
              placeholder="vd. Breakfast Buffet"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className={getInputClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ)</label>
            <input
              type="number"
              placeholder="25000"
              value={form.price ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                handleChange("price", val === "" ? "" : parseFloat(val));
              }}
              className={getInputClass("price")}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors.price}</p>}
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              rows={3}
              placeholder="Nhập mô tả dịch vụ"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={getInputClass("description") + " resize-none"}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {service ? "Lưu thay đổi" : "Lưu dịch vụ"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}