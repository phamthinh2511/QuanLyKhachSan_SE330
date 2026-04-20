import { Eye, Pencil, Trash2 } from "lucide-react";
import { Customer } from "@/types/customer";

interface Props {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id: number) => void;
  onView?: (data: Customer) => void;
}



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
              {["ID", "Họ tên", "Giới tính", "Ngày sinh", "Địa chỉ", "Phone", "Email", "CMND/CCCD", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-semibold text-gray-700">{c.id}</td>
                  <td className="px-4 py-4 font-medium text-gray-800 whitespace-nowrap">{c.name}</td>
                  <td className="px-4 py-4 text-gray-600">{c.gender}</td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.birthday}</td>
                  <td className="px-4 py-4 text-gray-600 max-w-[180px] truncate">{c.address}</td>
                  <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{c.phone}</td>
                  <td className="px-4 py-4 text-gray-600">{c.email}</td>
                  <td className="px-4 py-4 text-gray-600">{c.idCard}</td>

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