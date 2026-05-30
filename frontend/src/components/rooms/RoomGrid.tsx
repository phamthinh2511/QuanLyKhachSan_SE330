import { BedDouble, Pencil, Trash2 } from "lucide-react";
import { Room } from "@/types/room";
import clsx from "clsx";

interface Props {
  rooms: Room[];
  onEdit: (r: Room) => void;
  onDelete: (id: number) => void;
}

const statusStyle: Record<string, string> = {
  "Trống":          "bg-green-100 text-green-700",
  "Đang sử dụng":   "bg-orange-100 text-orange-700",
  "Đã đặt":         "bg-blue-100 text-blue-700",
  "Bảo trì":        "bg-red-100 text-red-500",
};

export default function RoomGrid({ rooms, onEdit, onDelete }: Props) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">Không tìm thấy phòng nào.</div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {rooms.map((r) => (
        <div key={r.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col gap-3">
          {/* Top */}
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-gray-800 text-lg">Phòng {r.roomNumber}</p>
              <p className="text-gray-400 text-sm">{r.type}</p>
            </div>
            <BedDouble className="w-5 h-5 text-gray-300" />
          </div>

          {/* Description */}
          <p className="text-gray-500 text-xs leading-relaxed">{r.description}</p>

          {/* Details */}
          <div className="space-y-1 text-sm">
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
          <span className={clsx("self-start px-2.5 py-1 rounded-full text-xs font-medium", statusStyle[r.status])}>
            {r.status}
          </span>

          {/* Actions */}
          <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
            <button
              onClick={() => onEdit(r)}
              className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 py-2 rounded-xl text-xs font-medium transition"
            >
              <Pencil className="w-3 h-3" /> Chỉnh sửa
            </button>
            <button
              onClick={() => onDelete(r.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}