"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Room, RoomStatus } from "@/types/room";
import { useRoomTypes } from "@/hooks/useRoomTypes";

interface Props {
  room: Room | null;
  onSave: (data: Room) => void;
  onClose: () => void;
}

const emptyForm: Room = {
  id: 0,
  roomNumber: "", 
  type: "", 
  floor: 1,
  capacity: 2, 
  pricePerNight: 0, 
  status: "Trống", 
  description: "",
  loaiPhongId: undefined,
};

export default function RoomModal({ room, onSave, onClose }: Props) {
  const [form, setForm] = useState<Room>(emptyForm);
  const { roomTypes, loading: loadingTypes } = useRoomTypes();

  useEffect(() => {
    setForm(room ? { ...room } : { ...emptyForm });
  }, [room]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.loaiPhongId && roomTypes.length > 0) {
        alert("Vui lòng chọn loại phòng.");
        return;
    }
    if (!room && (!form.id || form.id <= 0)) {
        alert("Vui lòng nhập Mã phòng hợp lệ (số nguyên dương).");
        return;
    }
    onSave({ ...form });
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    const selectedType = roomTypes.find(rt => rt.id === selectedId);
    if (selectedType) {
      setForm({
        ...form,
        loaiPhongId: selectedId,
        type: selectedType.tenLoaiPhong,
        pricePerNight: selectedType.donGia,
        capacity: selectedType.sucChuaToiDa,
        description: selectedType.moTa,
      });
    } else {
      setForm({
        ...form,
        loaiPhongId: undefined,
        type: "",
      });
    }
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã phòng (ID)</label>
              <input
                type="number"
                min={1}
                value={form.id || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value, 10);
                  setForm({ ...form, id: isNaN(val) ? 0 : val, roomNumber: e.target.value });
                }}
                className={inputClass}
                required
                disabled={!!room}
                placeholder="VD: 101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
              <input type="number" min={1} value={form.floor}
                onChange={(e) => setForm({ ...form, floor: +e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
              <select value={form.loaiPhongId || ""}
                onChange={handleTypeChange}
                className={inputClass} required disabled={loadingTypes}>
                <option value="" disabled>-- Chọn loại phòng --</option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>{rt.tenLoaiPhong}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (khách)</label>
              <input type="number" min={1} value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: +e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá/đêm (VNĐ)</label>
              <input type="number" min={0} value={form.pricePerNight}
                onChange={(e) => setForm({ ...form, pricePerNight: +e.target.value })}
                className={inputClass} required disabled />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea rows={3} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass + " resize-none"} disabled />
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