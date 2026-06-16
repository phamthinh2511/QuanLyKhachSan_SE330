import { Eye, Pencil, Trash2 } from "lucide-react";
import { Employee, EmployeePosition } from "@/types/employee";
import clsx from "clsx";

interface Props {
  employees: Employee[];
  onEdit: (e: Employee) => void;
  onDelete: (id: number) => void;
  onView?: (e: Employee) => void;
}

const positionStyle: Record<EmployeePosition, string> = {
  "Lễ Tân": "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Quản Lý":      "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Vệ Sinh": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Bếp":         "bg-orange-100 text-orange-800 border border-orange-200 hover:bg-orange-200 hover:text-orange-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Bảo Dưỡng":  "bg-cyan-100 text-cyan-800 border border-cyan-200 hover:bg-cyan-200 hover:text-cyan-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Bảo Vệ":     "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 hover:text-rose-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Khác":        "bg-indigo-100 text-indigo-800 border border-indigo-200 hover:bg-indigo-200 hover:text-indigo-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

// Avatar màu từ tên
const avatarColors = [
  "bg-blue-500", "bg-purple-500", "bg-green-500",
  "bg-orange-500", "bg-pink-500", "bg-indigo-500",
];

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase();
}

function getAvatarColor(id: number) {
  return avatarColors[id % avatarColors.length];
}

export default function EmployeeTable({ employees, onEdit, onDelete, onView }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Danh sách nhân viên ({employees.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Xem và quản lý tất cả nhân viên</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["Nhân viên", "Liên hệ", "Vị trí", "Phòng ban", "Tài khoản", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {employees.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
                  Không tìm thấy nhân viên nào.
                </td>
              </tr>
            ) : employees.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition">
                {/* Avatar + tên */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className={clsx("w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0", getAvatarColor(e.id))}>
                      {getInitials(e.name)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{e.name}</p>
                      <p className="text-gray-400 text-xs">{e.employeeCode}</p>
                    </div>
                  </div>
                </td>
                {/* Liên hệ */}
                <td className="px-4 py-4">
                  <p className="text-gray-700">{e.email}</p>
                  <p className="text-gray-400 text-xs">{e.phone}</p>
                </td>
                {/* Vị trí */}
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", positionStyle[e.position])}>
                    {e.position}
                  </span>
                </td>
                <td className="px-4 py-4 text-gray-600">{e.department}</td>
                <td className="px-4 py-4">
                  {e.username ? (
                    <div>
                      <p className="font-medium text-gray-800">{e.username}</p>
                      <span className={clsx("px-2 py-0.5 mt-1 inline-block rounded text-[10px] font-bold uppercase", 
                        e.role === "ADMIN" ? "bg-red-100 text-red-700" : (e.role === "MANAGER" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700")
                      )}>
                        {e.role}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-xs italic">Chưa có</span>
                  )}
                </td>
                {/* Trạng thái */}
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
                    e.status === "Đang làm việc" 
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900" 
                      : (e.status === "Đang nghỉ phép" 
                          ? "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200 hover:text-amber-900" 
                          : "bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200 hover:text-rose-900")
                  )}>
                    {e.status}
                  </span>
                </td>
                {/* Thao tác */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onView?.(e)}
                      className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition flex items-center justify-center font-medium"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(e)}
                      className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center font-medium"
                      title="Chỉnh sửa"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(e.id)}
                      className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center font-medium"
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