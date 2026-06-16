"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Customer, CustomerStatus } from "@/types/customer";
import { isNotEmpty, isValidEmail, isValidPhone, isValidIdCard, isPastDate } from "@/lib/validation";
import CustomSelect from "@/components/ui/CustomSelect";

interface Props {
  customer: Customer | null;
  onSave: (data: Customer) => void;
  onClose: () => void;
  onView?: (data: Customer) => void;
}

const emptyForm: Omit<Customer, "id"> = {
  name: "", phone: "", email: "", gender: "Nam",
  birthday: "", address: "", idCard: "", status: "Thường",
};

export default function CustomerModal({ customer, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Customer, "id">>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setForm(customer ? { ...customer } : emptyForm);
    setErrors({});
  }, [customer]);

  const handleChange = (field: keyof Omit<Customer, "id">, value: any) => {
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
    if (!isNotEmpty(form.idCard)) {
      newErrors.idCard = "CMND / CCCD không được để trống";
    } else if (!isValidIdCard(form.idCard)) {
      newErrors.idCard = "CMND / CCCD phải gồm 9 hoặc 12 chữ số";
    }
    if (!isNotEmpty(form.address)) {
      newErrors.address = "Địa chỉ không được để trống";
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
      await onSave({ ...form, id: customer?.id ?? 0 });
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
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800 text-lg">
            {customer ? "Chỉnh sửa khách hàng" : "Thêm khách hàng mới"}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          {/* Họ tên */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={(e) => handleChange("name", e.target.value)} 
              className={getInputClass("name")} 
            />
            {errors.name && <p className="text-red-500 text-xs mt-1 font-medium">{errors.name}</p>}
          </div>

          {/* Giới tính + Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <CustomSelect 
                value={form.gender} 
                onChange={(e) => handleChange("gender", e.target.value)} 
                className={getInputClass("gender")}
              >
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </CustomSelect>
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

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input 
                type="text" 
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
                value={form.email} 
                onChange={(e) => handleChange("email", e.target.value)} 
                className={getInputClass("email")} 
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 font-medium">{errors.email}</p>}
            </div>
          </div>

          {/* CMND */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CMND / CCCD</label>
            <input 
              type="text" 
              value={form.idCard} 
              onChange={(e) => handleChange("idCard", e.target.value)} 
              className={getInputClass("idCard")} 
            />
            {errors.idCard && <p className="text-red-500 text-xs mt-1 font-medium">{errors.idCard}</p>}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input 
              type="text" 
              value={form.address} 
              onChange={(e) => handleChange("address", e.target.value)} 
              className={getInputClass("address")} 
            />
            {errors.address && <p className="text-red-500 text-xs mt-1 font-medium">{errors.address}</p>}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <CustomSelect 
              value={form.status} 
              onChange={(e) => handleChange("status", e.target.value as CustomerStatus)} 
              className={getInputClass("status")}
            >
              <option>Thường</option>
              <option>VIP</option>
              <option>Khách hàng thân thiết</option>
            </CustomSelect>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit" disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSubmitting ? "Đang xử lý..." : (customer ? "Lưu thay đổi" : "Thêm khách hàng")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}