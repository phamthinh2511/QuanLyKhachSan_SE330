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
  "Thường":                 "bg-gray-100 text-gray-600",
  "VIP":                    "bg-purple-100 text-purple-700",
  "Khách hàng thân thiết":  "bg-yellow-100 text-yellow-700",
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
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => onView?.(c)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(c)}
                        className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
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