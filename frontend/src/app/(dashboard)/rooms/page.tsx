"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Room, RoomStatus } from "@/types/room";
import { useRooms } from "@/hooks/useRooms";
import RoomTable from "@/components/rooms/RoomTable";
import RoomGrid from "@/components/rooms/RoomGrid";
import RoomModal from "@/components/rooms/RoomModal";
import { apiClient } from "@/lib/api/client";

const PAGE_SIZE = 10;

export default function RoomsPage() {
  const { rooms, loading, error, handleCreate, handleUpdate, handleDelete } = useRooms();

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const [toasts, setToasts] = useState<{ id: string; type: "success" | "error"; message: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60 * 1000);
    return localToday.toISOString().split("T")[0];
  });
  const [bookings, setBookings] = useState<any[]>([]);

  const fetchBookings = async () => {
    try {
      const res = await apiClient<any>("/api/bookings/all");
      const list = res.result ? res.result : (Array.isArray(res) ? res : []);
      setBookings(list);
    } catch (err) {
      console.error("Lỗi tải bookings:", err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const roomsWithDynamicStatus = rooms.map((room) => {
    if (room.status === "Bảo trì") {
      return room;
    }

    const activeBooking = bookings.find((b) => {
      if (b.trangThai === "CANCELLED" || b.trangThai === "DA_TRA_PHONG" || b.trangThai === "CHECKED_OUT") {
        return false;
      }
      const roomIds = b.dsChiTietDatPhong?.map((ct: any) => ct.maPhong?.id) || [];
      const hasRoom = roomIds.includes(room.id);
      if (!hasRoom) return false;

      const checkIn = b.ngayNhan;
      const checkOut = b.ngayTra;
      return selectedDate >= checkIn && selectedDate < checkOut;
    });

    let computedStatus: RoomStatus = "Trống";
    if (activeBooking) {
      if (activeBooking.trangThai === "DA_NHAN_PHONG") {
        computedStatus = "Đang sử dụng";
      } else {
        computedStatus = "Đã đặt";
      }
    }

    return {
      ...room,
      status: computedStatus,
    };
  });

  const filtered = roomsWithDynamicStatus.filter((r) => {
    const matchSearch = r.roomNumber.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType   === "Tất cả" || r.type   === filterType;
    const matchStatus = filterStatus === "Tất cả" || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const visibleRooms = filtered.slice(0, visibleCount);
  const hasMore      = visibleCount < filtered.length;

  const handleSearch       = (val: string) => { setSearch(val);       setVisibleCount(PAGE_SIZE); };
  const handleFilterType   = (val: string) => { setFilterType(val);   setVisibleCount(PAGE_SIZE); };
  const handleFilterStatus = (val: string) => { setFilterStatus(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = async (data: Room) => {
    try {
      if (editing) {
        await handleUpdate(data.id, data);
        showToast("Cập nhật thông tin phòng thành công!");
      } else {
        await handleCreate(data);
        showToast("Thêm mới phòng thành công!");
      }
      setModalOpen(false);
      setEditing(null);
      fetchBookings();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Có lỗi xảy ra", "error");
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    const room = rooms.find((r) => r.id === id);
    const roomName = room ? `Phòng ${room.roomNumber}` : "phòng";
    if (!confirm(`Bạn có chắc muốn xóa ${roomName}?`)) return;
    try {
      await handleDelete(id);
      showToast(`Đã xóa ${roomName} thành công!`);
      fetchBookings();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Không thể xóa phòng", "error");
    }
  };

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="flex items-center gap-3 text-gray-500">
        <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
        Đang tải dữ liệu...
      </div>
    </div>
  );

  if (error) return (
    <div className="p-6 flex items-center justify-center min-h-64">
      <div className="text-center space-y-3">
        <p className="text-red-500 font-medium">{error}</p>
        <button onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl hover:bg-blue-700 transition">
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý các phòng khách sạn và tình trạng phòng</p>
        </div>
        <button onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition">
          <Plus className="w-4 h-4" /> Thêm phòng
        </button>
      </div>

      {/* Search + Filter + View toggle */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Tìm theo số phòng hoặc loại phòng..."
            value={search} onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <select value={filterType} onChange={(e) => handleFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tất cả</option>
          <option>Standard</option>
          <option>Deluxe</option>
          <option>Suite</option>
          <option>Presidential</option>
        </select>
        <select value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tất cả</option>
          <option>Trống</option>
          <option>Đang sử dụng</option>
          <option>Đã đặt</option>
          <option>Bảo trì</option>
        </select>
        <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3 py-2 bg-gray-50">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap">Xem ngày:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="text-sm text-gray-700 font-medium bg-transparent focus:outline-none"
          />
        </div>
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button onClick={() => setViewMode("list")}
            className={`p-2.5 transition ${viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button onClick={() => setViewMode("grid")}
            className={`p-2.5 transition ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-50"}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {viewMode === "list"
        ? <RoomTable rooms={visibleRooms} onEdit={(r) => { setEditing(r); setModalOpen(true); }} onDelete={handleDeleteConfirm} />
        : <RoomGrid  rooms={visibleRooms} onEdit={(r) => { setEditing(r); setModalOpen(true); }} onDelete={handleDeleteConfirm} />
      }

      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Đang hiển thị {visibleRooms.length} / {filtered.length} phòng
          </p>
          <button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition">
            Xem thêm 10 phòng
          </button>
        </div>
      )}

      {modalOpen && (
        <RoomModal
          room={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}

      {/* Toast Notification Container */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all duration-300 animate-slide-in ${
              toast.type === "success"
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {toast.type === "success" ? (
              <svg className="w-5 h-5 text-green-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-auto p-1 rounded-lg hover:bg-black/5 transition text-gray-500 hover:text-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}