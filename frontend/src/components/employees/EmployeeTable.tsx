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
  "Lễ Tân": "bg-blue-100 text-blue-700",
  "Quản Lý":      "bg-purple-100 text-purple-700",
  "Vệ Sinh": "bg-green-100 text-green-700",
  "Bếp":         "bg-orange-100 text-orange-600",
  "Bảo Dưỡng":  "bg-gray-100 text-gray-600",
  "Bảo Vệ":     "bg-red-100 text-red-600",
  "Khác":        "bg-gray-100 text-gray-500",
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
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium",
                    e.status === "Đang làm việc" ? "bg-green-100 text-green-700" : (e.status === "Đang nghỉ phép" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500")
                  )}>
                    {e.status}
                  </span>
                </td>
                {/* Thao tác */}
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onView?.(e)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(e)}
                      className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => onDelete(e.id)}
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