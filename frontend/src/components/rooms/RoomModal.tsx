"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Room, RoomType, RoomStatus } from "@/types/room";

interface Props {
  room: Room | null;
  onSave: (data: Room) => void;
  onClose: () => void;
}

const emptyForm: Omit<Room, "id"> = {
  roomNumber: "", type: "Thường", floor: 1,
  capacity: 2, pricePerNight: 0, status: "Trống", description: "",
};

export default function RoomModal({ room, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Room, "id">>(emptyForm);

  useEffect(() => {
    setForm(room ? { ...room } : emptyForm);
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: room?.id ?? 0 });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800 text-lg">
            {room ? "Chỉnh sửa phòng" : "Thêm phòng mới"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Số phòng + Tầng */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số phòng</label>
              <input type="text" value={form.roomNumber}
                onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
              <input type="number" min={1} value={form.floor}
                onChange={(e) => setForm({ ...form, floor: +e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          {/* Loại phòng + Sức chứa */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
              <select value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as RoomType })}
                className={inputClass}>
                <option>Thường</option>
                <option>Cao cấp</option>
                <option>Sang trọng</option>
                <option>Presidential</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (khách)</label>
              <input type="number" min={1} value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          {/* Giá/đêm + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá/đêm (đ)</label>
              <input type="number" min={0} value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: +e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as RoomStatus })}
                className={inputClass}>
                <option>Trống</option>
                <option>Đang sử dụng</option>
                <option>Đã đặt</option>
                <option>Bảo trì</option>
              </select>
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass + " resize-none"} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {room ? "Lưu thay đổi" : "Thêm phòng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}