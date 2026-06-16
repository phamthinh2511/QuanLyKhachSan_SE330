"use client";

import { X } from "lucide-react";
import { Customer } from "@/types/customer";
import clsx from "clsx";

interface Props {
  customer: Customer;
  onClose: () => void;
}

const statusStyle: Record<string, string> = {
  "Thường":                 "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "VIP":                    "bg-purple-100 text-purple-800 border border-purple-200 hover:bg-purple-200 hover:text-purple-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Khách hàng thân thiết":  "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

export default function CustomerViewModal({ customer, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Thông tin khách hàng</h2>
            <p className="text-gray-400 text-xs mt-0.5">Mã KH: {customer.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Thông tin cá nhân */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Thông tin cá nhân</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Họ tên</p>
                <p className="font-medium text-gray-800">{customer.name}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Giới tính</p>
                <p className="font-medium text-gray-800">{customer.gender}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Ngày sinh</p>
                <p className="font-medium text-gray-800">{customer.birthday}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Số CMND/CCCD</p>
                <p className="font-medium text-gray-800">{customer.idCard}</p>
              </div>
            </div>
          </div>

          {/* Liên hệ & Hạng khách hàng */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3 border-b border-gray-100 pb-2">Liên hệ & Trạng thái</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Số điện thoại</p>
                <p className="font-medium text-gray-800">{customer.phone}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{customer.email}</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-1">Địa chỉ</p>
                <p className="font-medium text-gray-800">{customer.address}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Hạng khách hàng</p>
                <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium", statusStyle[customer.status] || "bg-gray-100 text-gray-600")}>
                  {customer.status}
                </span>
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
