import { Pencil, Trash2 } from "lucide-react";
import { Booking } from "@/types/booking";
import clsx from "clsx";

interface Props {
  bookings: Booking[];
  onEdit: (b: Booking) => void;
  onDelete: (id: number) => void;
}

const statusStyle: Record<string, string> = {
  "Checked-in":  "bg-green-100 text-green-700",
  "Checked-out": "bg-gray-100 text-gray-500",
  "Đã đặt":      "bg-blue-100 text-blue-700",
  "Đã hủy":   "bg-red-100 text-red-500",
};

export default function BookingTodayTable({ bookings, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Booking hôm nay ({bookings.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Danh sách check-in trong ngày hôm nay</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["Mã booking", "Khách hàng", "Phòng", "Check-in", "Check-out", "Khách", "Số tiền", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-400">Không có booking nào hôm nay.</td>
              </tr>
            ) : bookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 font-bold text-gray-700">{b.bookingCode}</td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{b.customerName}</td>
                <td className="px-4 py-4 text-gray-600">{b.roomNumber}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{b.checkIn}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{b.checkOut}</td>
                <td className="px-4 py-4 text-gray-600">{b.guests}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{b.amount.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap", statusStyle[b.status])}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => onEdit(b)}
                      className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                      <Pencil className="w-3 h-3" /> Sửa
                    </button>
                    <button onClick={() => onDelete(b.id)}
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