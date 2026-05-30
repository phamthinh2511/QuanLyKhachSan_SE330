import { Pencil, Trash2 } from "lucide-react";
import { RoomTypeModel } from "@/types/room-type";

interface Props {
  roomTypes: RoomTypeModel[];
  onEdit: (rt: RoomTypeModel) => void;
  onDelete: (id: number) => void;
}

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
                  <td className="px-4 py-4 text-gray-600 max-w-[250px] truncate">{rt.moTa}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEdit(rt)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(rt.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
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
