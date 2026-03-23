"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { mockRooms } from "@/lib/data/rooms";
import { Room, RoomType, RoomStatus } from "@/types/room";
import RoomTable from "@/components/rooms/RoomTable";
import RoomGrid from "@/components/rooms/RoomGrid";
import RoomModal from "@/components/rooms/RoomModal";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>(mockRooms);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("Tất cả");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const filtered = rooms.filter((r) => {
    const matchSearch = r.roomNumber.includes(search) || r.type.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "Tất cả" || r.type === filterType;
    const matchStatus = filterStatus === "Tất cả" || r.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  const handleSave = (data: Room) => {
    if (editing) {
      setRooms((prev) => prev.map((r) => (r.id === data.id ? data : r)));
    } else {
      const newId = rooms.length > 0 ? Math.max(...rooms.map((r) => r.id)) + 1 : 1;
      setRooms((prev) => [...prev, { ...data, id: newId }]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (room: Room) => {
    setEditing(room);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa phòng này?")) {
      setRooms((prev) => prev.filter((r) => r.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>{/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý phòng</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin</p>
      </div>
    </div>

      {/* Search + Filter + View toggle */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3 items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo số phòng hoặc loại phòng..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Thêm phòng
        </button>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Thường</option>
          <option>Cao cấp</option>
          <option>Sang trọng</option>
          <option>Siêu cấp vip pro</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Trống</option>
          <option>Đang sử dụng</option>
          <option>Đã đặt</option>
          <option>Bảo trì</option>
        </select>

        {/* View toggle */}
        <div className="flex border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode("list")}
            className={`p-2.5 transition ${viewMode === "list" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-50"}`}
          >
            {/* List icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2.5 transition ${viewMode === "grid" ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-50"}`}
          >
            {/* Grid icon */}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      {viewMode === "list" ? (
        <RoomTable rooms={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      ) : (
        <RoomGrid rooms={filtered} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      {/* Modal */}
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