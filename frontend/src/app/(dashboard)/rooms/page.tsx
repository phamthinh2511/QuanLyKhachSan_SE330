"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Room } from "@/types/room";
import { useRooms } from "@/hooks/useRooms";
import RoomTable from "@/components/rooms/RoomTable";
import RoomGrid from "@/components/rooms/RoomGrid";
import RoomModal from "@/components/rooms/RoomModal";

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

  const filtered = rooms.filter((r) => {
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
      } else {
        await handleCreate(data);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa phòng này?")) return;
    try {
      await handleDelete(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xóa");
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
    </div>
  );
}