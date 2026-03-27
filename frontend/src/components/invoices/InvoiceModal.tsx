"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Invoice, PaymentMethod } from "@/types/invoice";
import { mockBookings } from "@/lib/data/bookings";
import { mockServiceUsages } from "@/lib/data/serviceusages";

interface Props {
  onSave: (data: Invoice) => void;
  onClose: () => void;
}

export default function InvoiceModal({ onSave, onClose }: Props) {
  const [bookingCode, setBookingCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("");
  const [roomCost, setRoomCost] = useState(0);
  const [serviceCost, setServiceCost] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  useEffect(() => {
    if (!bookingCode) {
      setRoomCost(0); setServiceCost(0);
      setCustomerName(""); setRoomNumber("");
      return;
    }
    const booking = mockBookings.find((b) => b.bookingCode === bookingCode);
    if (!booking) return;

    setCustomerName(booking.customerName);
    setRoomNumber(booking.roomNumber);
    setRoomCost(booking.amount);

    const services = mockServiceUsages.filter((u) => u.bookingCode === bookingCode);
    setServiceCost(services.reduce((s, u) => s + u.total, 0));
  }, [bookingCode]);

  const total = roomCost + serviceCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: 0,
      invoiceCode: "",
      bookingCode,
      customerName,
      roomNumber,
      roomCost,
      serviceCost,
      total,
      paymentMethod,
      status: paymentMethod ? "Paid" : "Pending",
      createdAt: new Date().toISOString().split("T")[0],
    });
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="font-semibold text-gray-800 text-lg">Tạo hóa đơn</h2>
            <p className="text-gray-400 text-xs mt-0.5">Tạo hóa đơn cho một booking</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Chọn booking */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Booking</label>
            <select value={bookingCode} onChange={(e) => setBookingCode(e.target.value)}
              className={inputClass} required>
              <option value="">Chọn booking</option>
              {mockBookings.map((b) => (
                <option key={b.id} value={b.bookingCode}>
                  {b.bookingCode} — {b.customerName}
                </option>
              ))}
            </select>
          </div>

          {/* Invoice Summary */}
          {bookingCode && (
            <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
              <p className="font-semibold text-gray-700 mb-3">Tóm tắt hóa đơn</p>
              <div className="flex justify-between text-gray-600">
                <span>Tiền phòng:</span>
                <span>${roomCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Dịch vụ:</span>
                <span>${serviceCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between font-bold text-gray-800">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">${total.toLocaleString()}</span>
              </div>
            </div>
          )}

          {/* Phương thức thanh toán */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
            <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className={inputClass}>
              <option value="">Chọn phương thức</option>
              <option>Credit Card</option>
              <option>Cash</option>
              <option>Bank Transfer</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
              Hủy
            </button>
            <button type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
              Tạo & Lưu
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}