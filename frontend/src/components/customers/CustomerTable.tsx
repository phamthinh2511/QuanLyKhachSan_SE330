import { Eye, Pencil, Trash2 } from "lucide-react";
import { Customer } from "@/types/customer";
import clsx from "clsx";

interface Props {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
  onView?: (data: Customer) => void;
}

const statusStyle: Record<string, string> = {
  "Thường":                 "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "VIP":                    "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Khách hàng thân thiết":  "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

export default function CustomerTable({ customers, onEdit, onDelete, onView }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">
          Danh sách khách hàng ({customers.length})
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">Xem và quản lý tất cả khách hàng</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["Mã KH", "Họ tên", "Số điện thoại", "Email", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-semibold text-gray-700">{c.id}</td>
                  <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-4 text-gray-600">{c.email}</td>
                  <td className="px-4 py-4">
                    <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", statusStyle[c.status])}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => onView?.(c)}
                        className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition flex items-center justify-center"
                        title="Xem">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center"
                        title="Sửa"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
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