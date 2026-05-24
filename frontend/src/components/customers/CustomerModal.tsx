"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Customer, CustomerStatus } from "@/types/customer";
import { ApiError } from "@/lib/api/client";

interface Props {
  customer: Customer | null;
  onSave: (data: Customer) => Promise<void>;
  onClose: () => void;
  onView?: (data: Customer) => void;
}

const emptyForm: Omit<Customer, "id"> = {
  name: "", phone: "", email: "", gender: "Nam",
  birthday: "", address: "", idCard: "", status: "Thường",
};

export default function CustomerModal({ customer, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Customer, "id">>(customer ? { ...customer } : emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }

    if (!form.birthday) {
      newErrors.birthday = "Ngày sinh không được để trống";
    } else {
      const birthDate = new Date(form.birthday);
      const today = new Date();
      if (birthDate > today) {
        newErrors.birthday = "Ngày sinh không thể ở tương lai";
      }
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]+$/.test(form.phone)) {
      newErrors.phone = "Số điện thoại chỉ được chứa các chữ số";
    } else if (form.phone.length !== 10) {
      newErrors.phone = "Số điện thoại phải có đúng 10 chữ số";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!form.idCard.trim()) {
      newErrors.idCard = "CMND / CCCD không được để trống";
    } else if (!/^[0-9]+$/.test(form.idCard)) {
      newErrors.idCard = "CMND/CCCD chỉ được chứa các chữ số";
    } else if (form.idCard.length < 9 || form.idCard.length > 12) {
      newErrors.idCard = "CMND/CCCD phải từ 9 đến 12 chữ số";
    }

    if (!form.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    try {
      await onSave({ ...form, id: customer?.id ?? 0 });
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        if (err.status === 422 && err.result) {
          const backendErrors: Record<string, string> = {};
          Object.entries(err.result).forEach(([key, val]) => {
            let translatedKey = key;
            let translatedVal = String(val);

            if (key === "type") translatedKey = "status";

            if (translatedVal.includes("cannot be blank")) {
              if (translatedKey === "name") translatedVal = "Tên khách hàng không được để trống";
              else if (translatedKey === "phone") translatedVal = "Số điện thoại không được để trống";
              else if (translatedKey === "gender") translatedVal = "Giới tính không được để trống";
              else if (translatedKey === "birthday") translatedVal = "Ngày sinh không được để trống";
              else if (translatedKey === "address") translatedVal = "Địa chỉ không được để trống";
              else if (translatedKey === "email") translatedVal = "Email không được để trống";
              else if (translatedKey === "idCard") translatedVal = "CMND/CCCD không được để trống";
            } else if (translatedVal.includes("must be exactly 10 digits")) {
              translatedVal = "Số điện thoại phải có đúng 10 chữ số";
            } else if (translatedVal.includes("Invalid email format")) {
              translatedVal = "Email không đúng định dạng";
            } else if (translatedVal.includes("must be between 9 and 12 digits")) {
              translatedVal = "CMND/CCCD phải từ 9 đến 12 chữ số";
            }

            backendErrors[translatedKey] = translatedVal;
          });
          setErrors(backendErrors);
        } else {
          const errMsg = String(err.message).toLowerCase();
          if (errMsg.includes("email")) {
            setErrors({ email: err.message });
          } else if (errMsg.includes("phone") || errMsg.includes("số điện thoại")) {
            setErrors({ phone: err.message });
          } else if (errMsg.includes("cmnd") || errMsg.includes("cccd") || errMsg.includes("id card")) {
            setErrors({ idCard: err.message });
          }
        }
      }
    }
  };

  const getInputClass = (fieldName: string) => {
    const hasError = !!errors[fieldName];
    return `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 transition-all ${
      hasError
        ? "border-red-300 focus:border-red-500 focus:ring-red-200"
        : "border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
    }`;
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
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={getInputClass("name")}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Giới tính + Ngày sinh */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className={getInputClass("gender")}
              >
                <option>Nam</option>
                <option>Nữ</option>
                <option>Khác</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <input
                type="date"
                value={form.birthday}
                onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                className={getInputClass("birthday")}
              />
              {errors.birthday && <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>}
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={getInputClass("phone")}
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={getInputClass("email")}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* CMND */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CMND / CCCD</label>
            <input
              type="text"
              value={form.idCard}
              onChange={(e) => setForm({ ...form, idCard: e.target.value })}
              className={getInputClass("idCard")}
            />
            {errors.idCard && <p className="text-red-500 text-xs mt-1">{errors.idCard}</p>}
          </div>

          {/* Địa chỉ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className={getInputClass("address")}
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
          </div>

          {/* Trạng thái */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as CustomerStatus })}
              className={getInputClass("status")}
            >
              <option>Thường</option>
              <option>VIP</option>
              <option>Khách hàng thân thiết</option>
            </select>
            {errors.status && <p className="text-red-500 text-xs mt-1">{errors.status}</p>}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              {customer ? "Lưu thay đổi" : "Thêm khách hàng"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}