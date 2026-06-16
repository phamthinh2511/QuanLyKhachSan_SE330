import { BedDouble, Pencil, Trash2 } from "lucide-react";
import { Room } from "@/types/room";
import clsx from "clsx";

interface Props {
  rooms: Room[];
  onEdit: (r: Room) => void;
  onDelete: (id: number) => void;
}

const statusStyle: Record<string, string> = {
  "Trống":          "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đang sử dụng":   "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 hover:text-rose-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã đặt":         "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Bảo trì":        "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

export default function RoomGrid({ rooms, onEdit, onDelete }: Props) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">Không tìm thấy phòng nào.</div>
    );
  }

  const borderStyle: Record<string, string> = {
    "Trống":          "border-l-emerald-500",
    "Đang sử dụng":   "border-l-rose-500",
    "Đã đặt":         "border-l-sky-500",
    "Bảo trì":        "border-l-amber-500",
  };

  const iconColorStyle: Record<string, string> = {
    "Trống":          "text-emerald-500 bg-emerald-50 border border-emerald-100",
    "Đang sử dụng":   "text-rose-500 bg-rose-50 border border-rose-100",
    "Đã đặt":         "text-sky-500 bg-sky-50 border border-sky-100",
    "Bảo trì":        "text-amber-500 bg-amber-50 border border-amber-100",
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {rooms.map((r) => (
        <div key={r.id} className={clsx("bg-white border border-gray-100 border-l-4 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1.5 hover:translate-x-1.5 transition-all duration-300 flex flex-col gap-3", borderStyle[r.status])}>
          {/* Top */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-gray-800 text-lg">Phòng {r.roomNumber}</p>
              <p className="text-gray-400 text-sm">{r.type}</p>
            </div>
            <div className={clsx("p-2 rounded-xl flex items-center justify-center", iconColorStyle[r.status])}>
              <BedDouble className="w-5 h-5" />
            </div>
          </div>

          {/* Description */}
          <div className="self-start">
            <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200",
              (r.description || "").toLowerCase().includes("cao cấp") || (r.description || "").toLowerCase().includes("deluxe") || (r.description || "").toLowerCase().includes("suite") || (r.description || "").toLowerCase().includes("vip")
                ? "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200"
                : "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200"
            )}>
              {r.description || "Phòng tiêu chuẩn"}
            </span>
          </div>

          {/* Details */}
          <div className="space-y-1 text-sm mt-1">
            <div className="flex justify-between">
              <span className="text-gray-400">Sức chứa:</span>
              <span className="font-semibold text-gray-700">{r.capacity} khách</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Tầng:</span>
              <span className="font-semibold text-gray-700">{r.floor}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Giá:</span>
              <span className="font-semibold text-blue-600">{r.pricePerNight.toLocaleString("vi-VN")} đ/đêm</span>
            </div>
          </div>

          {/* Status */}
          <span className={clsx("self-start px-2.5 py-1 rounded-full text-xs font-medium border mt-1", statusStyle[r.status])}>
            {r.status}
          </span>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit(r)}
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 hover:bg-amber-100 py-2 rounded-xl text-xs font-semibold transition"
            >
              <Pencil className="w-3 h-3" /> Chỉnh sửa
            </button>
            <button
              onClick={() => onDelete(r.id)}
              className="p-2 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-xl transition flex items-center justify-center"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}