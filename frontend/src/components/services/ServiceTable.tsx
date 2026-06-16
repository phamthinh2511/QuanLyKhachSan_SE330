import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/types/service";
import clsx from "clsx";

interface Props {
  services: Service[];
  onEdit: (s: Service) => void;
  onDelete: (id: number) => void;
  isAdmin?: boolean;
}

const getDescriptionBadgeStyle = (desc: string) => {
  const text = (desc || "").toLowerCase();
  if (text.includes("ăn") || text.includes("uống") || text.includes("ẩm thực") || text.includes("nước") || text.includes("bia") || text.includes("rượu")) {
    return "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
  }
  if (text.includes("spa") || text.includes("massage") || text.includes("thư giãn") || text.includes("đặc biệt") || text.includes("giặt")) {
    return "bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
  }
  return "bg-sky-100 text-sky-800 border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs";
};

export default function ServiceTable({ services, onEdit, onDelete, isAdmin = true }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Danh sách dịch vụ ({services.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Tất cả dịch vụ hiện có tại khách sạn</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["ID", "Tên dịch vụ", "Giá", "Mô tả", ...(isAdmin ? ["Thao tác"] : [])].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 5 : 4} className="px-6 py-10 text-center text-gray-400">
                  Không tìm thấy dịch vụ nào.
                </td>
              </tr>
            ) : services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-700">{s.serviceCode}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{s.price.toLocaleString("vi-VN")} VNĐ</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border", getDescriptionBadgeStyle(s.description))}>
                    {s.description || "Dịch vụ phòng"}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => onEdit(s)}
                        className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center"
                        title="Chỉnh sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => onDelete(s.id)}
                        className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center"
                        title="Xóa">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}