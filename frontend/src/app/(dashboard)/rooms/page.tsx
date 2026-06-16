"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import { Room, RoomStatus } from "@/types/room";
import { useRooms } from "@/hooks/useRooms";
import RoomTable from "@/components/rooms/RoomTable";
import RoomGrid from "@/components/rooms/RoomGrid";
import RoomModal from "@/components/rooms/RoomModal";
import { apiClient } from "@/lib/api/client";
import CustomSelect from "@/components/ui/CustomSelect";
import { mapBookingStatus } from "@/app/(dashboard)/bookings/page";
import PageSkeleton from "@/components/ui/PageSkeleton";
import PageError from "@/components/ui/PageError";
import { getUser } from "@/lib/auth";

interface BookingItem {
  id: number;
  bookingCode: string;
  customerName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  amount: number;
  status: string;
  dsChiTietDatPhong?: any[];
}

const PAGE_SIZE = 10;

export default function RoomsPage() {
  const { rooms, loading, error, handleCreate, handleUpdate, handleDelete } = useRooms();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    const currUser = getUser();
    setIsAdmin(currUser?.role === "ADMIN");
  }, []);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);
  const { showToast } = useToast();
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60 * 1000);
    return localToday.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const offset = tomorrow.getTimezoneOffset();
    const localTomorrow = new Date(tomorrow.getTime() - offset * 60 * 1000);
    return localTomorrow.toISOString().split("T")[0];
  });
  const [bookings, setBookings] = useState<BookingItem[]>([]);

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    if (val && endDate && val >= endDate) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      const offset = nextDay.getTimezoneOffset();
      const localNextDay = new Date(nextDay.getTime() - offset * 60 * 1000);
      setEndDate(localNextDay.toISOString().split("T")[0]);
    }
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    if (val && startDate && val <= startDate) {
      const prevDay = new Date(val);
      prevDay.setDate(prevDay.getDate() - 1);
      const offset = prevDay.getTimezoneOffset();
      const localPrevDay = new Date(prevDay.getTime() - offset * 60 * 1000);
      setStartDate(localPrevDay.toISOString().split("T")[0]);
    }
  };

  const fetchBookings = useCallback(async () => {
    try {
      const res = await apiClient<BookingItem[]>("/api/bookings/all");
      const list = Array.isArray(res) ? res : [];
      const mapped = list.map((b) => ({
        ...b,
        status: mapBookingStatus(b.status)
      }));
      setBookings(mapped);
    } catch (err) {
      console.error("Lỗi tải bookings:", err);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);




  const roomsWithDynamicStatus = rooms.map((room) => {
    if (room.status === "Bảo trì" || (room as any).trangThai === "Bảo trì") {
      return room;
    }

    const dbStatus = room.status || (room as any).trangThai || "Trống";

    // 1. Chuyển đổi Ngày đến / Ngày đi từ thanh công cụ FE thành đối tượng Date
    const filterStart = new Date(startDate);
    const filterEnd = new Date(endDate);

    // Đặt mốc giờ về 00:00:00 để so sánh chính xác theo "Ngày"
    filterStart.setHours(0, 0, 0, 0);
    filterEnd.setHours(0, 0, 0, 0);

    const activeBooking = bookings.find((b) => {
      if (b.status === "Đã hủy" || b.status === "Đã trả phòng") {
        return false;
      }

      // ✅ ĐÃ KHẮC PHỤC: Lấy Số phòng chuẩn chỉnh từ room.roomNumber hoặc room.id
      const bookingRoomStr = String(b.roomNumber).trim();
            const hasRoom =
              bookingRoomStr === String(room.roomNumber).trim() ||
              bookingRoomStr === String(room.id).trim();

            if (!hasRoom) return false;
      // 2. Chuyển đổi ngày checkIn/checkOut của Đơn đặt phòng thành đối tượng Date
      if (!b.checkIn || !b.checkOut) return false;
      const bookingIn = new Date(b.checkIn);
      const bookingOut = new Date(b.checkOut);

      bookingIn.setHours(0, 0, 0, 0);
      bookingOut.setHours(0, 0, 0, 0);

      // 3. Logic so sánh khoảng ngày giao nhau
      return filterStart < bookingOut && filterEnd > bookingIn;
    });

    // Quyết định trạng thái hiển thị
    let computedStatus: RoomStatus = dbStatus;

    if (activeBooking) {
          // Chuẩn hóa chuỗi trạng thái để so sánh an toàn, tránh lệch pha ký tự
          const currentStatus = String(activeBooking.status).toLowerCase().trim();

          // Kiểm tra tất cả các trường hợp có thể đại diện cho "Đang sử dụng"
          if (
            currentStatus === "đang sử dụng" ||
            currentStatus === "dang_su_dung" ||
            currentStatus === "checked-in" ||
            currentStatus === "checked_in"
          ) {
            computedStatus = "Đang sử dụng";
          } else {
            computedStatus = "Đã đặt";
          }
    } else {
      const hômNayStr = new Date().toISOString().split("T")[0];
      if (startDate === hômNayStr) {
        computedStatus = dbStatus as RoomStatus;
      }
    }

    return {
      ...room,
      roomNumber: String(room.roomNumber || room.id),
      status: computedStatus,
    };
  });


  const filtered = roomsWithDynamicStatus.filter((r) => {
    const matchSearch = r.roomNumber.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchType   = filterType   === "Tất cả" || r.type   === filterType;
    const matchStatus = filterStatus === "Tất cả" || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  }).sort((a, b) => a.id - b.id);

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

  if (loading) {
    return <PageSkeleton type="table" />;
  }

  if (error) {
    return <PageError message={error} />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="p-6 rounded-lg bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý các phòng khách sạn và tình trạng phòng</p>
        </div>
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
        {isAdmin && (
          <button onClick={() => { setEditing(null); setModalOpen(true); }}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shrink-0">
            <Plus className="w-4 h-4" /> Thêm phòng
          </button>
        )}
        <CustomSelect value={filterType} onChange={(e) => handleFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tất cả</option>
          <option>Standard</option>
          <option>Deluxe</option>
          <option>Suite</option>
          <option>Presidential</option>
        </CustomSelect>
        <CustomSelect value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tất cả</option>
          <option>Trống</option>
          <option>Đang sử dụng</option>
          <option>Đã đặt</option>
          <option>Bảo trì</option>
        </CustomSelect>


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
        ? <RoomTable rooms={visibleRooms} onEdit={(r) => { setEditing(r); setModalOpen(true); }} onDelete={handleDeleteConfirm} isAdmin={isAdmin} />
        : <RoomGrid  rooms={visibleRooms} onEdit={(r) => { setEditing(r); setModalOpen(true); }} onDelete={handleDeleteConfirm} isAdmin={isAdmin} />
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


    </div>
  );
}