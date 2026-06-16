"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { RoomTypeModel } from "@/types/room-type";
import { isNotEmpty, isNonNegativeNumber, isPositiveInteger } from "@/lib/validation";

interface Props {
  roomType: RoomTypeModel | null;
  onSave: (data: Omit<RoomTypeModel, "id"> | RoomTypeModel) => void;
  onClose: () => void;
}

const emptyForm: Omit<RoomTypeModel, "id"> = {
  tenLoaiPhong: "",
  donGia: 0,
  moTa: "",
  sucChuaToiDa: 1,
};

export default function RoomTypeModal({ roomType, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<RoomTypeModel, "id" | "donGia" | "sucChuaToiDa"> & { donGia: number | ""; sucChuaToiDa: number | "" }>({
    ...emptyForm,
    donGia: roomType ? roomType.donGia : "",
    sucChuaToiDa: roomType ? roomType.sucChuaToiDa : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (roomType) {
      setForm({ ...roomType });
    } else {
      setForm(emptyForm as any);
    }
    setErrors({});
  }, [roomType]);

  const handleChange = (field: keyof Omit<RoomTypeModel, "id">, value: any) => {
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

    if (!isNotEmpty(form.tenLoaiPhong)) newErrors.tenLoaiPhong = "Tên loại phòng không được để trống";
    if (form.donGia === "" || form.donGia === undefined || form.donGia === null || !isNonNegativeNumber(form.donGia)) {
      newErrors.donGia = "Đơn giá phải là số không âm";
    }
    if (!form.sucChuaToiDa || !isPositiveInteger(form.sucChuaToiDa)) {
      newErrors.sucChuaToiDa = "Sức chứa tối đa phải lớn hơn hoặc bằng 1";
    }
    if (!isNotEmpty(form.moTa)) newErrors.moTa = "Mô tả không được để trống";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const dataToSave = {
      ...form,
      donGia: form.donGia === "" ? 0 : form.donGia,
      sucChuaToiDa: form.sucChuaToiDa === "" ? 1 : form.sucChuaToiDa,
    };
    if (roomType) {
      onSave({ ...dataToSave, id: roomType.id } as any);
    } else {
      onSave(dataToSave as any);
    }
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800 text-lg">
            {roomType ? "Chỉnh sửa loại phòng" : "Thêm loại phòng mới"}
          </h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại phòng</label>
            <input 
              type="text" 
              value={form.tenLoaiPhong} 
              onChange={(e) => handleChange("tenLoaiPhong", e.target.value)} 
              className={getInputClass("tenLoaiPhong")} 
              placeholder="VD: Phòng Gia Đình"
            />
            {errors.tenLoaiPhong && <p className="text-red-500 text-xs mt-1 font-medium">{errors.tenLoaiPhong}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
              <input 
                type="number" 
                value={form.donGia ?? ""} 
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("donGia", val === "" ? "" : parseFloat(val));
                }} 
                className={getInputClass("donGia")} 
              />
              {errors.donGia && <p className="text-red-500 text-xs mt-1 font-medium">{errors.donGia}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa tối đa</label>
              <input 
                type="number" 
                value={form.sucChuaToiDa ?? ""} 
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("sucChuaToiDa", val === "" ? "" : parseInt(val, 10));
                }} 
                className={getInputClass("sucChuaToiDa")} 
              />
              {errors.sucChuaToiDa && <p className="text-red-500 text-xs mt-1 font-medium">{errors.sucChuaToiDa}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea 
              value={form.moTa} 
              onChange={(e) => handleChange("moTa", e.target.value)} 
              className={getInputClass("moTa")} 
              rows={3}
              placeholder="Mô tả tiện ích, không gian..."
            />
            {errors.moTa && <p className="text-red-500 text-xs mt-1 font-medium">{errors.moTa}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {roomType ? "Lưu thay đổi" : "Thêm loại phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
