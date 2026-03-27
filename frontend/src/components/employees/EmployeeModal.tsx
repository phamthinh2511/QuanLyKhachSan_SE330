"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Employee, EmployeePosition, EmployeeStatus } from "@/types/employee";

interface Props {
  employee: Employee | null;
  onSave: (data: Employee) => void;
  onClose: () => void;
}

const emptyForm: Omit<Employee, "id" | "employeeCode"> = {
  name: "", email: "", phone: "",
  position: "Receptionist", department: "",
  joinDate: "", status: "Active",
};

export default function EmployeeModal({ employee, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Employee, "id" | "employeeCode">>(emptyForm);

  useEffect(() => {
    if (employee) {
      const { id, employeeCode, ...rest } = employee;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
  }, [employee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: employee?.id ?? 0, employeeCode: employee?.employeeCode ?? "" });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">
              {employee ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">Nhập thông tin nhân viên bên dưới</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Họ tên + SĐT */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input type="text" placeholder="Nhập họ tên" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input type="text" placeholder="+84 234-567-8900" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" placeholder="employee@hotel.com" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={inputClass} required />
          </div>

          {/* Vị trí + Phòng ban */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <select value={form.position}
                onChange={(e) => setForm({ ...form, position: e.target.value as EmployeePosition })}
                className={inputClass}>
                <option>Receptionist</option>
                <option>Manager</option>
                <option>Housekeeping</option>
                <option>Chef</option>
                <option>Maintenance</option>
                <option>Security</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input type="text" placeholder="vd. Front Desk" value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className={inputClass} required />
            </div>
          </div>

          {/* Ngày vào + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vào làm</label>
              <input type="date" value={form.joinDate}
                onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
                className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <select value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as EmployeeStatus })}
                className={inputClass}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              {employee ? "Lưu thay đổi" : "Thêm nhân viên"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}