"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/lib/api/client";
import { Plus } from "lucide-react";
//import { mockBookings } from "@/lib/data/bookings";
import { Booking, BookingStatus } from "@/types/booking";
import BookingStatCards from "@/components/bookings/BookingStatCards";
import BookingTodayTable from "@/components/bookings/BookingTodayTable";
import BookingAllTable from "@/components/bookings/BookingAllTable";
import BookingModal from "@/components/bookings/BookingModal";

const today = new Date().toISOString().split("T")[0];
const PAGE_SIZE_ALL = 50;

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE_ALL);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Booking | null>(null);

        const fetchData = useCallback(async () => {
            try {
              setLoading(true);
              const response = await apiClient<any>("/api/bookings/all");
              const mappedData = response.result ? response.result.map((b: any) => ({
                id: b.id,
                bookingCode: `BK-${1000 + b.id}`,
                customerName: b.maKhachHang?.tenKhachHang || "Khách vãng lai",
                roomNumber: b.dsChiTietDatPhong?.map((ct: any) => ct.maPhong?.id).join(", ") || "Chưa gán",
                checkIn: b.ngayNhan,
                checkOut: b.ngayTra,
                status: b.trangThai === "DA_NHAN_PHONG" ? "Checked-in" : "Booked",
                amount: b.dsChiTietDatPhong?.reduce((sum: number, ct: any) => sum + (ct.donGia || 0), 0) || 0,
                guests: 1
              })) : (Array.isArray(response) ? response.map((b: any) => ({
                id: b.id,
                bookingCode: `BK-${1000 + b.id}`,
                customerName: b.maKhachHang?.tenKhachHang || "Khách vãng lai",
                roomNumber: b.dsChiTietDatPhong?.map((ct: any) => ct.maPhong?.id).join(", ") || "Chưa gán",
                checkIn: b.ngayNhan,
                checkOut: b.ngayTra,
                status: b.trangThai === "DA_NHAN_PHONG" ? "Checked-in" : "Booked",
                amount: b.dsChiTietDatPhong?.reduce((sum: number, ct: any) => sum + (ct.donGia || 0), 0) || 0,
                guests: 1
              })) : []);
              setBookings(mappedData);
            } catch (error) {
              console.error("Lỗi kết nối API:", error);
            } finally {
              setLoading(false);
            }
          }, []);
        useEffect(() => {
            fetchData();
          }, [fetchData]);


  // Danh sách hôm nay — không filter, không phân trang
  const todayBookings = bookings.filter((b) => b.checkIn === today);

  // Danh sách tất cả — có search + filter + load more
  const allFiltered = bookings.filter((b) => {
    const matchSearch =
      b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      b.customerName.toLowerCase().includes(search.toLowerCase()) ||
      b.roomNumber.includes(search);
    const matchFilter = filter === "Tất cả" || b.status === filter;
    return matchSearch && matchFilter;
  });

  const visibleAll = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE_ALL); };
  const handleFilter = (val: string) => { setFilter(val); setVisibleCount(PAGE_SIZE_ALL); };

//   const handleSave = (data: Booking) => {
//     if (editing) {
//       setBookings((prev) => prev.map((b) => (b.id === data.id ? data : b)));
//     } else {
//       const newId = bookings.length > 0 ? Math.max(...bookings.map((b) => b.id)) + 1 : 1;
//       const newCode = `BK-${String(1000 + newId)}`;
//       setBookings((prev) => [...prev, { ...data, id: newId, bookingCode: newCode }]);
//     }
//     setModalOpen(false);
//     setEditing(null);
//   };
        const handleSave = async (data: any) => {
            try {
              if (editing) {
                // Viết API Update ở Backend trước khi dùng ở đây
                alert("Chức năng cập nhật đang được phát triển");
              } else {
                // Map dữ liệu từ Form Modal sang BookingRequest của Backend
                const bookingRequest = {
                  maKhachHang: data.customerId || 1, // Giả sử ID khách hàng là 1 nếu form chưa có
                  ngayNhan: data.checkIn,
                  ngayTra: data.checkOut,
                  dsMaPhong: [parseInt(data.roomNumber) || 101] // Lấy ID phòng từ form
                };

                const response = await apiClient<any>("/api/bookings/create", {
                  method: "POST",
                  body: JSON.stringify(bookingRequest),
                });

                if (response) {
                  alert("Thêm mới đặt phòng thành công vào Database!");
                  await fetchData(); // Tải lại dữ liệu mới nhất từ Neon DB
                }
              }
            } catch (error: any) {
              console.error("Lỗi khi lưu dữ liệu:", error);
              alert("Lỗi: " + (error.message || "Không thể kết nối Backend"));
            }
            setModalOpen(false);
            setEditing(null);
          };

   const handleEdit = (booking: Booking) => {
    setEditing(booking);
    setModalOpen(true);
  };

//   const handleDelete = (id: number) => {
//     if (confirm("Bạn có chắc muốn xóa booking này?")) {
//       setBookings((prev) => prev.filter((b) => b.id !== id));
//     }
//   };
const handleDelete = async (id: number) => {
  if (confirm("Bạn có chắc muốn xóa booking này?")) {
    try {
      await apiClient(`/api/bookings/delete/${id}`, { method: "DELETE" });
      // Cập nhật lại UI sau khi xóa thành công
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      alert("Lỗi khi xóa dữ liệu trên Server!");
    }
  }
};

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="p-6 rounded-lg bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý đặt phòng</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>

      {/* Stat cards — tính từ toàn bộ bookings */}
      <BookingStatCards bookings={bookings} />

      {/* Hôm nay */}
      <BookingTodayTable
        bookings={todayBookings}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Tất cả — search + filter + load more */}
      <div className="space-y-4">
        {/* Search + Filter */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo mã booking, tên khách, số phòng..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Đặt phòng mới
        </button>
          <select
            value={filter}
            onChange={(e) => handleFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Tất cả</option>
            <option>Checked-in</option>
            <option>Checked-out</option>
            <option>Booked</option>
            <option>Cancelled</option>
          </select>
        </div>

        <BookingAllTable
          bookings={visibleAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {hasMore && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              Đang hiển thị {visibleAll.length} / {allFiltered.length} booking
            </p>
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE_ALL)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-xl transition"
            >
              Xem thêm 50 booking
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <BookingModal
          booking={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}