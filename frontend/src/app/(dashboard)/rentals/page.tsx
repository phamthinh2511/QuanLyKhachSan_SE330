
"use client";

import { useState } from "react";
import { Eye, Trash2, Search, Filter, Pencil } from "lucide-react"; // Đã thêm Pencil
import { useRentals } from "@/hooks/useRentals";
import { RentalSlip } from "@/lib/api/rentals";
import { checkOutBooking } from "@/lib/api/bookings"; // Import API xử lý Check-out chuyển trạng thái sang Đã trả phòng & Tạo hóa đơn
import RentalDetailModal from "@/components/rentals/RentalDetailModal";
import clsx from "clsx";

const PAGE_SIZE = 50;

const statusStyle: Record<string, string> = {
  "Đang sử dụng": "bg-green-50 text-green-700 border border-green-200",
  "Đã nhận phòng tại quầy": "bg-green-50 text-green-700 border border-green-200",
  "Đang ở": "bg-green-50 text-green-700 border border-green-200",
  "Checked-in": "bg-green-50 text-green-700 border border-green-200",
  "Đã trả phòng": "bg-gray-50 text-gray-500 border border-gray-200",
  "Checked-out": "bg-gray-50 text-gray-500 border border-gray-200",
  "Đã hủy": "bg-red-50 text-red-600 border border-red-200",
};

export default function RentalsPage() {
  const { rentals, loading, error, removeRental } = useRentals();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedRental, setSelectedRental] = useState<RentalSlip | null>(null);
  const [actionLoading, setActionLoading] = useState(false); // Quản lý trạng thái khi đang gọi API trả phòng

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

  const actualRentals = Array.isArray(rentals)
    ? rentals
    : (rentals && typeof rentals === 'object' && 'result' in rentals && Array.isArray((rentals as any).result))
      ? (rentals as any).result
      : [];

  const filteredRentals = actualRentals.filter((r) => {
    const norm = getNormalizedStatus(r.status);

    // Chỉ chấp nhận những phiếu đang ở hoặc đã trả phòng hoàn tất
    const isCorrectType = norm === "Đang sử dụng" || norm === "Đã trả phòng";
    if (!isCorrectType) return false;

    const matchSearch =
      (r.rentalCode?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (r.roomNumber?.toLowerCase() || "").includes(search.toLowerCase());

    const matchStatus = filterStatus === "Tất cả" || norm === filterStatus;

    return matchSearch && matchStatus;
  });

  const visibleRentals = filteredRentals.slice(0, visibleCount);
  const hasMore = visibleCount < filteredRentals.length;

  const handleDelete = async (id: number, code: string) => {
      if (confirm(`Bạn có chắc chắn muốn hủy phiếu thuê phòng ${code}? Điều này sẽ giải phóng trạng thái phòng về trống.`)) {
        try {
          await removeRental(id);
          alert(`Đã hủy phiếu thuê phòng ${code} thành công!`);
        } catch (err: any) {
          const errorMessage = (err.message || "").toLowerCase();

          // Kiểm tra lỗi khóa ngoại ràng buộc dữ liệu với dịch vụ phòng
          if (errorMessage.includes("sudungdichvu") || errorMessage.includes("foreign key")) {
            alert(
              `Không thể hủy phiếu thuê ${code}!\n\n` +
              `Lý do: Phiếu thuê này đang có dữ liệu sử dụng dịch vụ đi kèm (gọi đồ ăn, nước uống, dịch vụ khác...). ` +
              `Vui lòng vào mục "Yêu Cầu Dịch Vụ" để xóa hết các dịch vụ của phòng này trước khi thực hiện hủy phiếu.`
            );
          } else {
            alert(err.message || "Không thể hủy phiếu thuê phòng do trục trặc từ hệ thống.");
          }
        }
      }
    };

  // Hàm xử lý đổi trạng thái sang Đã trả phòng & Tạo hóa đơn thông qua API checkOutBooking
  const handleCheckOutRental = async (bookingId: number, rentalCode: string) => {
    const isConfirmed = window.confirm(`Bạn có chắc chắn muốn làm thủ tục Trả phòng (Check-out) và xuất hóa đơn cho phiếu ${rentalCode} không?`);
    if (!isConfirmed) return;

    try {
      setActionLoading(true);
      // Thực hiện đổi trạng thái sang "Đã trả phòng" đồng thời đẩy dữ liệu kết xuất qua hóa đơn
      await checkOutBooking(bookingId, "");
            alert(`Trả phòng thành công! Phiếu ${rentalCode} đã chuyển sang trạng thái 'Đã trả phòng' và khởi tạo hóa đơn (Chưa thanh toán).`);
      window.location.reload();
    } catch (err: any) {
      alert(err.message || "Xử lý thủ tục trả phòng thất bại!");
    } finally {
      setActionLoading(false);
    }
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
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setVisibleCount(PAGE_SIZE); }}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="Tất cả">Tất cả</option>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Đã trả phòng">Đã trả phòng</option>
          </select>
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
                  visibleRentals.map((r) => {
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
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedRental(r)}
                              className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium transition"
                            >
                              <Eye className="w-3.5 h-3.5" /> Xem
                            </button>

                            {/* Nút Sửa (Check-out): Chỉ hiển thị khi trạng thái là "Đang sử dụng" */}
                            {normStatus === "Đang sử dụng" && (
                              <button
                                onClick={() => handleCheckOutRental(r.id, r.rentalCode)}
                                disabled={actionLoading}
                                className="flex items-center gap-1.5 border border-blue-200 bg-blue-50 text-blue-600 hover:border-blue-300 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition disabled:opacity-50"
                              >
                                <Pencil className="w-3.5 h-3.5" /> Trả phòng
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(r.id, r.rentalCode)}
                              title="Hủy phiếu thuê"
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
    </div>
  );
}