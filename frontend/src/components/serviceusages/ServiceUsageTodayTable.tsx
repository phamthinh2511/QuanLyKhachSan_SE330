import { Pencil, Trash2 } from "lucide-react";
import { ServiceUsage } from "@/types/serviceUsage";
import clsx from "clsx";

interface Props {
  usages: ServiceUsage[];
  onEdit: (u: ServiceUsage) => void;
  onDelete: (id: number) => void;
  onRowContextMenu?: (e: React.MouseEvent, usage: ServiceUsage) => void;
}

const statusStyle = {
  "Đã sử dụng":    "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Chờ sử dụng": "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã hủy": "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 hover:text-rose-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

const headers = ["ID", "Booking", "Khách hàng", "Phòng", "Dịch vụ", "SL", "Đơn giá", "Tổng", "Ngày", "Trạng thái", "Thao tác"];

export default function ServiceUsageTodayTable({ usages, onEdit, onDelete, onRowContextMenu }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Dịch vụ hôm nay ({usages.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Các dịch vụ được sử dụng trong ngày hôm nay</p>
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
                  Không có dịch vụ nào được sử dụng hôm nay.
                </td>
              </tr>
            ) : usages.map((u) => (
              <tr key={u.id}
                onContextMenu={(e) => onRowContextMenu && onRowContextMenu(e, u)}
                className="hover:bg-gray-50 transition"
              >
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
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyle[u.status])}>
                    {u.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onEdit(u)}
                      className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 text-amber-600 hover:bg-amber-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button onClick={() => onDelete(u.id)}
                      className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center"
                      title="Xóa"
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