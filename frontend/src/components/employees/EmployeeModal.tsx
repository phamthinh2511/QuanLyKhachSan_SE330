"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Employee, EmployeePosition, EmployeeStatus } from "@/types/employee";
import { isNotEmpty, isValidEmail, isValidPhone, isPastDate, isAtLeastAge } from "@/lib/validation";
import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
  employee: Employee | null;
  onSave: (data: Employee) => void;
  onClose: () => void;
}

const emptyForm: Omit<Employee, "id" | "employeeCode"> = {
  name: "", birthday: "", email: "", phone: "",
  position: "Lễ Tân", department: "",
  joinDate: "", status: "Đang làm việc",
  username: "", password: "", role: "NHAN_VIEN",
};

export default function EmployeeModal({ employee, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Employee, "id" | "employeeCode">>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      const { id, employeeCode, ...rest } = employee;
      setForm(rest);
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [employee]);

  const handleChange = (field: keyof Omit<Employee, "id" | "employeeCode">, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!isNotEmpty(form.name)) newErrors.name = "Họ tên không được để trống";
    
    if (!isNotEmpty(form.birthday)) {
      newErrors.birthday = "Ngày sinh không được để trống";
    } else if (!isPastDate(form.birthday)) {
      newErrors.birthday = "Ngày sinh phải là ngày trong quá khứ";
    } else if (!isAtLeastAge(form.birthday, 18)) {
      newErrors.birthday = "Nhân viên phải từ 18 tuổi trở lên";
    }

    if (!isNotEmpty(form.phone)) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!isValidPhone(form.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (9-11 chữ số, bắt đầu bằng 0 hoặc +84)";
    }

    if (!isNotEmpty(form.email)) {
      newErrors.email = "Email không được để trống";
    } else if (!isValidEmail(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!isNotEmpty(form.department)) {
      newErrors.department = "Phòng ban không được để trống";
    }

    if (!isNotEmpty(form.joinDate)) {
      newErrors.joinDate = "Ngày vào làm không được để trống";
    }

    // Tài khoản
    if (!employee) {
      if (!form.username || form.username.trim().length === 0) {
        newErrors.username = "Tên đăng nhập không được để trống";
      } else if (form.username.length < 3) {
        newErrors.username = "Tên đăng nhập phải chứa ít nhất 3 ký tự";
      }
    } else {
      if (form.username && form.username.length < 3) {
        newErrors.username = "Tên đăng nhập phải chứa ít nhất 3 ký tự";
      }
    }

    if (form.password && form.password.trim().length > 0) {
      if (form.password.length < 6) {
        newErrors.password = "Mật khẩu phải chứa ít nhất 6 ký tự";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      await onSave({ ...form, id: employee?.id ?? 0, employeeCode: employee?.employeeCode ?? "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInputClass = (fieldName: string) => {
    const baseClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-slate-800 transition duration-150";
    if (errors[fieldName]) {
      return `${baseClass} border-red-500 focus:ring-red-200 focus:border-red-500`;
    }
    return baseClass;
  };

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

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Họ tên + Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
              <input 
                type="text" 
                placeholder="Nhập họ tên" 
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                className={getInputClass("name")} 
              />
              {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input 
                type="date" 
                value={form.birthday}
                onChange={(e) => handleChange("birthday", e.target.value)}
                className={getInputClass("birthday")} 
              />
              {errors.birthday && <p className="text-red-500 text-xs mt-1 font-medium">{errors.birthday}</p>}
            </div>
          </div>

          {/* SĐT + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input 
                type="text" 
                placeholder="+84 234-567-8900" 
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={getInputClass("phone")} 
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1 font-medium">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input 
                type="email" 
                placeholder="employee@hotel.com" 
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className={getInputClass("email")} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>

          {/* Vị trí + Phòng ban */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí</label>
              <CustomSelect 
                value={form.position}
                onChange={(e) => handleChange("position", e.target.value as EmployeePosition)}
                className={getInputClass("position")}
              >
                <option value="Lễ Tân">Lễ Tân</option>
                <option value="Quản Lý">Quản Lý</option>
                <option value="Vệ Sinh">Vệ Sinh</option>
                <option value="Bếp">Bếp</option>
                <option value="Bảo Dưỡng">Bảo Dưỡng</option>
                <option value="Bảo Vệ">Bảo Vệ</option>
                <option value="Khác">Khác</option>
              </CustomSelect>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phòng ban</label>
              <input 
                type="text" 
                placeholder="vd. Front Desk" 
                value={form.department}
                onChange={(e) => handleChange("department", e.target.value)}
                className={getInputClass("department")} 
              />
              {errors.department && <p className="text-red-500 text-xs mt-1 font-medium">{errors.department}</p>}
            </div>
          </div>

          {/* Ngày vào + Trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày vào làm</label>
              <input 
                type="date" 
                value={form.joinDate}
                onChange={(e) => handleChange("joinDate", e.target.value)}
                className={getInputClass("joinDate")} 
              />
              {errors.joinDate && <p className="text-red-500 text-xs mt-1 font-medium">{errors.joinDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
              <CustomSelect 
                value={form.status}
                onChange={(e) => handleChange("status", e.target.value as EmployeeStatus)}
                className={getInputClass("status")}
              >
                <option value="Đang làm việc">Đang làm việc</option>
                <option value="Đã nghỉ việc">Đã nghỉ việc</option>
                <option value="Đang nghỉ phép">Đang nghỉ phép</option>
              </CustomSelect>
            </div>
          </div>

          {/* Tài khoản */}
          <div className="pt-4 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Thông tin tài khoản</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên đăng nhập</label>
                <input 
                  type="text" 
                  placeholder="Tên đăng nhập" 
                  value={form.username || ""}
                  onChange={(e) => handleChange("username", e.target.value)}
                  className={getInputClass("username")} 
                />
                {errors.username && <p className="text-red-500 text-xs mt-1 font-medium">{errors.username}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu {employee && <span className="text-xs text-gray-400 font-normal">(để trống nếu không đổi)</span>}
                </label>
                <input 
                  type="password" 
                  placeholder="Mật khẩu" 
                  value={form.password || ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={getInputClass("password")} 
                />
                {errors.password && <p className="text-red-500 text-xs mt-1 font-medium">{errors.password}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài khoản (Quyền)</label>
              <CustomSelect 
                value={form.role || "NHAN_VIEN"}
                onChange={(e) => handleChange("role", e.target.value)}
                className={getInputClass("role")}
              >
                <option value="ADMIN">Quản trị viên (ADMIN)</option>
                <option value="MANAGER">Quản lý (MANAGER)</option>
                <option value="NHAN_VIEN">Nhân viên (NHAN_VIEN)</option>
              </CustomSelect>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Đang xử lý..." : (employee ? "Lưu thay đổi" : "Thêm nhân viên")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}