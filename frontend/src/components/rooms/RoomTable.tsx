import { Pencil, Trash2 } from "lucide-react";
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

export default function RoomTable({ rooms, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Danh sách phòng ({rooms.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Xem và quản lý tất cả các phòng</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["Số phòng", "Loại", "Tầng", "Sức chứa", "Giá/đêm", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">Không tìm thấy phòng nào.</td>
              </tr>
            ) : rooms.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-700">{r.roomNumber}</td>
                <td className="px-6 py-4 text-gray-600">{r.type}</td>
                <td className="px-6 py-4 text-gray-600">{r.floor}</td>
                <td className="px-6 py-4 text-gray-600">{r.capacity} khách</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{r.pricePerNight.toLocaleString("vi-VN")} đ</td>
                <td className="px-6 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyle[r.status])}>
                    {r.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => onEdit(r)}
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                    >
                      <Pencil className="w-3 h-3" /> Sửa
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}