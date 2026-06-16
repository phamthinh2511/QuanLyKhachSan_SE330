
"use client";

import { useState } from "react";
import { Eye, Trash2, Search, Filter, LogOut } from "lucide-react";
import { useRentals } from "@/hooks/useRentals";
import { RentalSlip } from "@/lib/api/rentals";
import RentalDetailModal from "@/components/rentals/RentalDetailModal";
import CheckoutModal from "@/components/invoices/CheckoutModal";
import clsx from "clsx";
import { useToast } from "@/context/ToastContext";
import CustomSelect from "@/components/ui/CustomSelect";

const PAGE_SIZE = 50;

const statusStyle: Record<string, string> = {
  "Đang sử dụng": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã nhận phòng tại quầy": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đang ở": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Checked-in": "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã trả phòng": "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Checked-out": "bg-sky-100 text-sky-800 border border-sky-200 hover:bg-sky-200 hover:text-sky-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Đã hủy": "bg-rose-100 text-rose-800 border border-rose-200 hover:bg-rose-200 hover:text-rose-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

export default function RentalsPage() {
  const { rentals, loading, error, removeRental } = useRentals();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedRental, setSelectedRental] = useState<RentalSlip | null>(null);
  // Phiếu thuê đang được chọn để trả phòng (mở CheckoutModal)
  const [checkoutRental, setCheckoutRental] = useState<RentalSlip | null>(null);

  const getNormalizedStatus = (status: string) => {
    if (!status) return "Chưa xác định";
    const s = status.trim();
    if (s === "Đang sử dụng" || s === "Checked-in" || s === "Đã nhận phòng tại quầy" || s === "Đang ở") {
      return "Đang sử dụng";
    }
    if (s === "Đã trả phòng" || s === "Checked-out") {
      return "Đã trả phòng";
    }
    if (s === "Đã hủy" || s === "CANCELLED") {
      return "Đã hủy";
    }
    return s;
  };

  // Array safety: xử lý trường hợp API trả về object thay vì array (từ main)
  const actualRentals = Array.isArray(rentals)
    ? rentals
    : (rentals && typeof rentals === 'object' && 'result' in rentals && Array.isArray((rentals as any).result))
      ? (rentals as any).result
      : [];

  const filteredRentals = actualRentals.filter((r: RentalSlip) => {
    const norm = getNormalizedStatus(r.status);

    const isCorrectType = norm === "Đang sử dụng" || norm === "Đã trả phòng";
    if (!isCorrectType) return false;

    const matchSearch =
      (r.rentalCode?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.roomNumber?.toLowerCase() || "").includes(search.toLowerCase());

    const matchStatus = filterStatus === "Tất cả" || norm === filterStatus;

    return matchSearch && matchStatus;
  });
    const sortedRentals = [...filteredRentals].sort((a, b) => {
        if (filterStatus === "Đang sử dụng") {
          return new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime();
        }
        if (filterStatus === "Đã trả phòng") {
          return b.id - a.id;
        }
        return b.id - a.id;
      });
  const visibleRentals = sortedRentals.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRentals.length;

  const handleDelete = async (id: number, code: string) => {
    if (confirm(`Bạn có chắc chắn muốn hủy phiếu thuê phòng ${code}? Điều này sẽ giải phóng trạng thái phòng về trống.`)) {
      try {
        await removeRental(id);
        showToast(`Đã hủy phiếu thuê phòng ${code} thành công!`);
      } catch (err: any) {
        const errorMessage = (err.message || "").toLowerCase();
        if (errorMessage.includes("sudungdichvu") || errorMessage.includes("foreign key")) {
          showToast(
            `Không thể hủy phiếu thuê ${code}!\n\n` +
            `Lý do: Phiếu thuê này đang có dữ liệu sử dụng dịch vụ đi kèm (gọi đồ ăn, nước uống, dịch vụ khác...). ` +
            `Vui lòng vào mục "Yêu Cầu Dịch Vụ" để xóa hết các dịch vụ của phòng này trước khi thực hiện hủy phiếu.`,
            "error"
          );
        } else {
          showToast(err.message || "Không thể hủy phiếu thuê phòng do trục trặc từ hệ thống.", "error");
        }
      }
    }
  };
  const handleCheckoutSuccess = () => {
    setCheckoutRental(null);
    window.location.reload();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-white shadow-sm flex flex-col md:flex-row md:justify-between md:items-center border border-gray-100 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Danh sách Phiếu thuê phòng</h1>
          <p className="text-gray-500 text-sm">Quản lý nhận phòng, thời gian lưu trú và đơn giá thuê chi tiết.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã phiếu, khách hàng, số phòng..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 text-slate-800"
          />
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50/30 text-sm text-gray-500">
            <Filter className="w-4 h-4 text-gray-400" />
            <span>Trạng thái:</span>
          </div>
          <CustomSelect
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Đã trả phòng">Đã trả phòng</option>
          </CustomSelect>
        </div>
      </div>

      {/* Table List */}
      {loading && (!rentals || actualRentals.length === 0) ? (
        <div className="p-12 text-center text-gray-400 text-sm bg-white border border-gray-100 rounded-2xl shadow-sm">
          Đang đồng bộ dữ liệu phiếu thuê phòng...
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500 text-sm bg-white border border-gray-100 rounded-2xl shadow-sm">
          {error}
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h2 className="font-semibold text-gray-800">Danh sách phiếu thuê phòng ({filteredRentals.length})</h2>
              <p className="text-gray-400 text-xs mt-0.5">Toàn bộ lịch sử tiếp đón và thuê phòng tại khách sạn</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide bg-gray-50/20">
                  {["Mã phiếu", "Khách hàng", "Phòng", "Check-in", "Check-out", "Khách", "Giá thuê/đêm", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-4 py-3.5 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {visibleRentals.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center text-gray-400">
                      Không tìm thấy phiếu thuê phòng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  visibleRentals.map((r: RentalSlip) => {
                    const normStatus = getNormalizedStatus(r.status);
                    return (
                      <tr key={r.id} className="hover:bg-gray-50 transition group">
                        <td className="px-4 py-4 font-bold text-gray-700">{r.rentalCode}</td>
                        <td className="px-4 py-4 text-gray-700 whitespace-nowrap font-medium">{r.customerName}</td>
                        <td className="px-4 py-4 text-gray-600 font-semibold">Phòng {r.roomNumber}</td>
                        <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{r.checkIn}</td>
                        <td className="px-4 py-4 text-gray-500 whitespace-nowrap">{r.checkOut}</td>
                        <td className="px-4 py-4 text-gray-600">{r.guests}</td>
                        <td className="px-4 py-4 font-semibold text-gray-700">
                          {r.roomPrice.toLocaleString()} VND
                        </td>
                        <td className="px-4 py-4">
                          <span className={clsx("px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap", statusStyle[r.status] || "bg-gray-100 text-gray-600")}>
                            {normStatus}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => setSelectedRental(r)}
                              className="flex items-center gap-1.5 bg-blue-50 border border-blue-100 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Xem
                            </button>

                            {/* Nút Trả phòng: Chỉ hiển thị khi đang sử dụng → mở CheckoutModal */}
                            {normStatus === "Đang sử dụng" && (
                              <button
                                onClick={() => setCheckoutRental(r)}
                                className="flex items-center gap-1.5 border border-orange-200 bg-orange-50 text-orange-600 hover:border-orange-300 hover:bg-orange-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition"
                              >
                                <LogOut className="w-3.5 h-3.5" /> Trả phòng
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Load More Pagination */}
          {hasMore && (
            <div className="flex flex-col items-center gap-2 p-6 border-t border-gray-150">
              <p className="text-sm text-gray-400">
                Đang hiển thị {visibleRentals.length} / {filteredRentals.length} phiếu thuê phòng
              </p>
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="px-6 py-2 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-xl transition"
              >
                Xem thêm phiếu thuê phòng
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedRental && (
        <RentalDetailModal
          rental={selectedRental}
          onClose={() => setSelectedRental(null)}
        />
      )}

      {/* Checkout Modal - mở khi nhấn nút Trả phòng */}
      {checkoutRental && (
        <CheckoutModal
          maPhieuThue={checkoutRental.id}
          maPhong={parseInt(checkoutRental.roomNumber) || 0}
          maNhanVien={1} // TODO: lấy từ session đăng nhập
          khachHang={checkoutRental.customerName}
          onSuccess={handleCheckoutSuccess}
          onClose={() => setCheckoutRental(null)}
        />
      )}
    </div>
  );
}