import { Pencil, Trash2 } from "lucide-react";
import { Booking } from "@/types/booking";
import clsx from "clsx";

interface Props {
  bookings: Booking[];
  onEdit: (b: Booking) => void;
  onDelete: (id: number) => void;
  onRowContextMenu?: (e: React.MouseEvent, booking: Booking) => void;
}

const statusStyle: Record<string, string> = {
  "Đang sử dụng": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã trả phòng": "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Checked-in":   "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Checked-out":  "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã đặt":       "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã hủy":       "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 hover:text-rose-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đặt trước":    "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

export default function BookingTodayTable({ bookings, onEdit, onDelete, onRowContextMenu }: Props) {
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
              <tr key={b.id} className="hover:bg-gray-50 transition"
                onContextMenu={(e) => onRowContextMenu?.(e, b)}>
                <td className="px-4 py-4 font-bold text-gray-700">{b.bookingCode}</td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{b.customerName}</td>
                <td className="px-4 py-4 text-gray-600">{b.roomNumber}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{b.checkIn}</td>
                <td className="px-4 py-4 text-gray-600 whitespace-nowrap">{b.checkOut}</td>
                <td className="px-4 py-4 text-gray-600">{b.guests}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{b.amount.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border", statusStyle[b.status])}>
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onEdit(b)}
                      className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center gap-1.5 text-xs font-semibold px-2.5 py-1.5"
                      title="Sửa"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Sửa
                    </button>
                    <button
                      onClick={() => {
                        const isConfirmed = window.confirm(`Bạn có chắc chắn muốn xóa đơn đặt phòng ${b.bookingCode} của khách ${b.customerName} không?`);
                        if (isConfirmed) {
                          onDelete(b.id);
                        }
                      }}
                      title="Xóa đơn đặt"
                      className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center"
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