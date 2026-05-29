import { Pencil, Trash2 } from "lucide-react";
import { Service } from "@/types/service";

interface Props {
  services: Service[];
  onEdit: (s: Service) => void;
  onDelete: (id: number) => void;
}

export default function ServiceTable({ services, onEdit, onDelete }: Props) {
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
              {["ID", "Tên dịch vụ", "Giá", "Mô tả", "Thao tác"].map((h) => (
                <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400">
                  Không tìm thấy dịch vụ nào.
                </td>
              </tr>
            ) : services.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-bold text-gray-700">{s.serviceCode}</td>
                <td className="px-6 py-4 font-medium text-gray-800">{s.name}</td>
                <td className="px-6 py-4 font-semibold text-gray-800">{s.price.toLocaleString("vi-VN")} VNĐ</td>
                <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{s.description}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(s)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(s.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">
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