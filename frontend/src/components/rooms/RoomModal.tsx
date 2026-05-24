"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Room, RoomStatus } from "@/types/room";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { ApiError } from "@/lib/api/client";

interface Props {
  room: Room | null;
  onSave: (data: Room) => Promise<void> | void;
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { roomTypes, loading: loadingTypes } = useRoomTypes();

  useEffect(() => {
    setForm(room ? { ...room } : { ...emptyForm });
    setErrors({});
  }, [room]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!room) {
      if (!form.id || form.id <= 0) {
        newErrors.id = "Mã phòng phải là số nguyên dương lớn hơn 0";
      }
    }

    if (!form.floor || form.floor <= 0) {
      newErrors.floor = "Tầng phải là số nguyên dương lớn hơn 0";
    }

    if (!form.loaiPhongId) {
      newErrors.loaiPhongId = "Vui lòng chọn loại phòng";
    }

    if (!form.capacity || form.capacity <= 0) {
      newErrors.capacity = "Sức chứa phải là số nguyên dương lớn hơn 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;
    try {
      await onSave({ ...form });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        const errMsg = String(err.message).toLowerCase();
        if (errMsg.includes("đã tồn tại") || errMsg.includes("already exists") || errMsg.includes("duplicate") || errMsg.includes("trùng")) {
          setErrors({ id: "Mã phòng đã tồn tại trên hệ thống!" });
        } else {
          setErrors({ submit: err.message });
        }
      } else if (err instanceof Error) {
        setErrors({ submit: err.message });
      }
    }
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

  const getInputClass = (fieldName: string) => {
    const hasError = !!errors[fieldName];
    return `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
    }`;
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mã phòng (ID)</label>
              <input
                type="number"
                value={form.id || ""}
                onChange={(e) => {
                  const cleanedValue = e.target.value.replace(/^0+/, "");
                  const val = parseInt(cleanedValue, 10);
                  setForm({ ...form, id: isNaN(val) ? 0 : val, roomNumber: cleanedValue });
                }}
                className={getInputClass("id")}
                disabled={!!room}
                placeholder="VD: 101"
              />
              {errors.id && <p className="text-red-500 text-xs mt-1">{errors.id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
              <input type="number" value={form.floor || ""}
                onChange={(e) => {
                  const cleanedValue = e.target.value.replace(/^0+/, "");
                  const val = parseInt(cleanedValue, 10);
                  setForm({ ...form, floor: isNaN(val) ? 0 : val });
                }}
                className={getInputClass("floor")} />
              {errors.floor && <p className="text-red-500 text-xs mt-1">{errors.floor}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
              <select value={form.loaiPhongId || ""}
                onChange={handleTypeChange}
                className={getInputClass("loaiPhongId")} disabled={loadingTypes}>
                <option value="" disabled>-- Chọn loại phòng --</option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>{rt.tenLoaiPhong}</option>
                ))}
              </select>
              {errors.loaiPhongId && <p className="text-red-500 text-xs mt-1">{errors.loaiPhongId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (khách)</label>
              <input type="number" value={form.capacity || ""}
                onChange={(e) => {
                  const cleanedValue = e.target.value.replace(/^0+/, "");
                  const val = parseInt(cleanedValue, 10);
                  setForm({ ...form, capacity: isNaN(val) ? 0 : val });
                }}
                className={getInputClass("capacity")} />
              {errors.capacity && <p className="text-red-500 text-xs mt-1">{errors.capacity}</p>}
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

          {errors.submit && (
            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-xl py-2">{errors.submit}</p>
          )}

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