import { Pencil, Trash2 } from "lucide-react";
import { ServiceUsage } from "@/types/serviceUsage";
import clsx from "clsx";

interface Props {
  usages: ServiceUsage[];
  onEdit: (u: ServiceUsage) => void;
  onDelete: (id: number) => void;
}

const statusStyle = {
  "Đã sử dụng":    "bg-green-100 text-green-700",
  "Chờ sử dụng": "bg-orange-100 text-orange-600",
  "Đã hủy": "bg-red-100 text-red-700",
};

const headers = ["ID", "Booking", "Khách hàng", "Phòng", "Dịch vụ", "SL", "Đơn giá", "Tổng", "Ngày", "Trạng thái", "Thao tác"];

export default function ServiceUsageAllTable({ usages, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Tất cả bản ghi ({usages.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Toàn bộ lịch sử sử dụng dịch vụ</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {headers.map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {usages.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-8 text-center text-gray-400">
                  Không tìm thấy bản ghi nào.
                </td>
              </tr>
            ) : usages.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 font-bold text-gray-700">{u.usageCode}</td>
                <td className="px-4 py-4 text-gray-600">{u.bookingCode}</td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{u.customerName}</td>
                <td className="px-4 py-4 text-gray-600">{u.roomNumber}</td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{u.serviceName}</td>
                <td className="px-4 py-4 text-gray-600">{u.quantity}</td>
                <td className="px-4 py-4 text-gray-600">{u.unitPrice}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{u.total}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{u.date}</td>
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", statusStyle[u.status])}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(u)}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                      <Pencil className="w-3 h-3" /> Sửa
                    </button>
                    <button onClick={() => onDelete(u.id)}
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