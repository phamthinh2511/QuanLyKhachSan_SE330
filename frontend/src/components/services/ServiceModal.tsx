"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Service, ServiceCategory } from "@/types/service";

interface Props {
  service: Service | null;
  onSave: (data: Service) => void;
  onClose: () => void;
}

const emptyForm: Omit<Service, "id" | "serviceCode"> = {
  name: "", category: "Ăn uống", price: 0, description: "",
};

export default function ServiceModal({ service, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Service, "id" | "serviceCode">>(emptyForm);

  useEffect(() => {
    if (service) {
      const { id, serviceCode, ...rest } = service;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [service]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: service?.id ?? 0, serviceCode: service?.serviceCode ?? "" });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Tên + Danh mục */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên dịch vụ</label>
              <input
                type="text"
                placeholder="vd. Breakfast Buffet"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as ServiceCategory })}
                className={inputClass}
              >
                <option>Food & Beverage</option>
                <option>Housekeeping</option>
                <option>Wellness</option>
                <option>Transportation</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Giá */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Giá ($)</label>
            <input
              type="number"
              min={0}
              placeholder="25"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: +e.target.value })}
              className={inputClass}
              required
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea
              rows={3}
              placeholder="Nhập mô tả dịch vụ"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass + " resize-none"}
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