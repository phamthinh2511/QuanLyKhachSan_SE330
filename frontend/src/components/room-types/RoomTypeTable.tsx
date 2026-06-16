import { Pencil, Trash2 } from "lucide-react";
import { RoomTypeModel } from "@/types/room-type";
import clsx from "clsx";

interface Props {
  roomTypes: RoomTypeModel[];
  onEdit: (rt: RoomTypeModel) => void;
  onDelete: (id: number) => void;
}

const getDescriptionBadgeStyle = (moTa: string) => {
  const text = (moTa || "").toLowerCase();
  if (text.includes("cao cấp") || text.includes("deluxe") || text.includes("suite") || text.includes("vip")) {
    return "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
  }
  if (text.includes("tiêu chuẩn") || text.includes("standard")) {
    return "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
  }
  return "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
};

export default function RoomTypeTable({ roomTypes, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">
          Danh mục loại phòng ({roomTypes.length})
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">Quản lý các loại phòng và giá cả</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["ID", "Tên loại phòng", "Đơn giá", "Sức chứa", "Mô tả", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {roomTypes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  Không có dữ liệu loại phòng.
                </td>
              </tr>
            ) : (
              roomTypes.map((rt) => (
                <tr key={rt.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-semibold text-gray-700">{rt.id}</td>
                  <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap">{rt.tenLoaiPhong}</td>
                  <td className="px-4 py-4 text-gray-600 font-medium text-blue-600">
                    {rt.donGia.toLocaleString("vi-VN")} đ
                  </td>
                  <td className="px-4 py-4 text-gray-600">{rt.sucChuaToiDa} người</td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border", getDescriptionBadgeStyle(rt.moTa))}>
                      {rt.moTa}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onEdit(rt)}
                        className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center"
                        title="Chỉnh sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(rt.id)}
                        className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
