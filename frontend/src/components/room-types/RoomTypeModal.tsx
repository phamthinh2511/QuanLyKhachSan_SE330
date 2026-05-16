"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { RoomTypeModel } from "@/types/room-type";

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
  const [form, setForm] = useState<Omit<RoomTypeModel, "id">>(emptyForm);

  useEffect(() => {
    if (roomType) {
      setForm({ ...roomType });
    } else {
      setForm(emptyForm);
    }
  }, [roomType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomType) {
      onSave({ ...form, id: roomType.id });
    } else {
      onSave(form);
    }
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên loại phòng</label>
            <input 
              type="text" 
              value={form.tenLoaiPhong} 
              onChange={(e) => setForm({ ...form, tenLoaiPhong: e.target.value })} 
              className={inputClass} 
              required 
              placeholder="VD: Phòng Gia Đình"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Đơn giá (VNĐ)</label>
              <input 
                type="number" 
                value={form.donGia} 
                onChange={(e) => setForm({ ...form, donGia: Number(e.target.value) })} 
                className={inputClass} 
                required 
                min={0}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa tối đa</label>
              <input 
                type="number" 
                value={form.sucChuaToiDa} 
                onChange={(e) => setForm({ ...form, sucChuaToiDa: Number(e.target.value) })} 
                className={inputClass} 
                required 
                min={1}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea 
              value={form.moTa} 
              onChange={(e) => setForm({ ...form, moTa: e.target.value })} 
              className={inputClass} 
              required
              rows={3}
              placeholder="Mô tả tiện ích, không gian..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {roomType ? "Lưu thay đổi" : "Thêm loại phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
