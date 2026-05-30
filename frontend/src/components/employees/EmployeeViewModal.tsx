"use client";

import { X } from "lucide-react";
import { Employee } from "@/types/employee";
import clsx from "clsx";

interface Props {
  employee: Employee;
  onClose: () => void;
}

export default function EmployeeViewModal({ employee, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Thông tin nhân viên</h2>
            <p className="text-gray-400 text-xs mt-0.5">Mã nhân viên: {employee.employeeCode}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cơ bản */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Thông tin cơ bản</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Họ tên</p>
                <p className="font-medium text-gray-800">{employee.name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày sinh</p>
                <p className="font-medium text-gray-800">{employee.birthday || "—"}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium text-gray-800">{employee.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{employee.email}</p>
              </div>
            </div>
          </div>

          {/* Công việc */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Thông tin công việc</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Vị trí</p>
                <p className="font-medium text-gray-800">{employee.position}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Phòng ban</p>
                <p className="font-medium text-gray-800">{employee.department}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày vào làm</p>
                <p className="font-medium text-gray-800">{employee.joinDate}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Trạng thái</p>
                <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium",
                  employee.status === "Đang làm việc" ? "bg-green-100 text-green-700" :
                  employee.status === "Đang nghỉ phép" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"
                )}>
                  {employee.status}
                </span>
              </div>
            </div>
          </div>

          {/* Tài khoản */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Tài khoản hệ thống</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Tên đăng nhập</p>
                {employee.username ? (
                  <p className="font-medium text-gray-800">{employee.username}</p>
                ) : (
                  <p className="italic text-gray-400">Chưa cấp tài khoản</p>
                )}
              </div>
              <div>
                <p className="text-gray-500 mb-1">Quyền truy cập</p>
                {employee.role ? (
                  <span className={clsx("px-2 py-0.5 mt-1 inline-block rounded text-xs font-bold uppercase", 
                    employee.role === "ADMIN" ? "bg-red-100 text-red-700" : 
                    employee.role === "MANAGER" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  )}>
                    {employee.role}
                  </span>
                ) : (
                  <p className="italic text-gray-400">—</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end">
          <button onClick={onClose}
            className="px-6 py-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 rounded-xl text-sm font-medium transition shadow-sm">
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
