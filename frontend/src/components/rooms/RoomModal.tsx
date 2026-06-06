"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Room, RoomStatus } from "@/types/room";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { isPositiveInteger } from "@/lib/validation";

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
  const [form, setForm] = useState<Omit<Room, "id" | "floor" | "capacity"> & { id: number | ""; floor: number | ""; capacity: number | "" }>({
    ...emptyForm,
    id: room ? room.id : "",
    floor: room ? room.floor : "",
    capacity: room ? room.capacity : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { roomTypes, loading: loadingTypes } = useRoomTypes();

  useEffect(() => {
    setForm(room ? { ...room } : { ...emptyForm } as any);
    setErrors({});
  }, [room]);

  const handleChange = (field: keyof Room, value: any) => {
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

    if (!room && (!form.id || !isPositiveInteger(form.id))) {
      newErrors.id = "Mã phòng phải là số nguyên dương";
    }
    if (!form.floor || !isPositiveInteger(form.floor)) {
      newErrors.floor = "Tầng phải là số nguyên dương";
    }
    if (!form.loaiPhongId) {
      newErrors.loaiPhongId = "Vui lòng chọn loại phòng";
    }
    if (!form.capacity || !isPositiveInteger(form.capacity)) {
      newErrors.capacity = "Sức chứa phải lớn hơn hoặc bằng 1";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form } as any);
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
    if (errors.loaiPhongId) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.loaiPhongId;
        return next;
      });
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
                min={1}
                value={form.id ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  const parsedVal = val === "" ? "" : parseInt(val, 10);
                  setForm((prev) => ({ ...prev, id: parsedVal as any, roomNumber: val }));
                  if (errors.id) {
                    setErrors((prev) => {
                      const next = { ...prev };
                      delete next.id;
                      return next;
                    });
                  }
                }}
                className={getInputClass("id")}
                disabled={!!room}
                placeholder="VD: 101"
              />
              {errors.id && <p className="text-red-500 text-xs mt-1 font-medium">{errors.id}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tầng</label>
              <input 
                type="number" 
                min={1} 
                value={form.floor ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("floor", val === "" ? "" : parseInt(val, 10));
                }}
                className={getInputClass("floor")} 
              />
              {errors.floor && <p className="text-red-500 text-xs mt-1 font-medium">{errors.floor}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại phòng</label>
              <select 
                value={form.loaiPhongId || ""}
                onChange={handleTypeChange}
                className={getInputClass("loaiPhongId")} 
                disabled={loadingTypes}
              >
                <option value="" disabled>-- Chọn loại phòng --</option>
                {roomTypes.map((rt) => (
                  <option key={rt.id} value={rt.id}>{rt.tenLoaiPhong}</option>
                ))}
              </select>
              {errors.loaiPhongId && <p className="text-red-500 text-xs mt-1 font-medium">{errors.loaiPhongId}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sức chứa (khách)</label>
              <input 
                type="number" 
                min={1} 
                value={form.capacity ?? ""}
                onChange={(e) => {
                  const val = e.target.value;
                  handleChange("capacity", val === "" ? "" : parseInt(val, 10));
                }}
                className={getInputClass("capacity")} 
              />
              {errors.capacity && <p className="text-red-500 text-xs mt-1 font-medium">{errors.capacity}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá/đêm (VNĐ)</label>
              <input 
                type="number" 
                min={0} 
                value={form.pricePerNight}
                className={getInputClass("pricePerNight")} 
                disabled 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái hoạt động</label>
              <div className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-gray-50 text-slate-800 flex items-center h-[38px]">
                {form.status === "Bảo trì" ? (
                  <span className="flex items-center gap-1.5 text-red-600 font-medium text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                    Đang bảo trì
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-green-600 font-medium text-sm">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                    Hoạt động bình thường
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Công tắc bảo trì */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl bg-gray-50/50">
            <div className="pr-4">
              <span className="block text-sm font-semibold text-gray-700">Chế độ bảo trì</span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Chuyển phòng sang trạng thái bảo trì để tạm ngưng nhận khách và đặt phòng
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleChange("status", form.status === "Bảo trì" ? "Trống" : "Bảo trì")}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                form.status === "Bảo trì" ? "bg-red-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  form.status === "Bảo trì" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
            <textarea 
              rows={3} 
              value={form.description}
              className={getInputClass("description") + " resize-none"} 
              disabled 
            />
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