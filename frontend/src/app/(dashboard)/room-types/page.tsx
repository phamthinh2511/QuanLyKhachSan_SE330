"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRoomTypes } from "@/hooks/useRoomTypes";
import { useToast } from "@/context/ToastContext";
import { RoomTypeModel } from "@/types/room-type";
import RoomTypeTable from "@/components/room-types/RoomTypeTable";
import RoomTypeModal from "@/components/room-types/RoomTypeModal";
import PageSkeleton from "@/components/ui/PageSkeleton";
import PageError from "@/components/ui/PageError";

const PAGE_SIZE = 50;

export default function RoomTypesPage() {
  const { roomTypes, loading, error, handleCreate, handleUpdate, handleDelete } = useRoomTypes();
  const { showToast } = useToast();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoomTypeModel | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const filtered = roomTypes.filter((rt) => {
    return rt.tenLoaiPhong.toLowerCase().includes(search.toLowerCase());
  });

  const visibleRoomTypes = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = async (data: Omit<RoomTypeModel, "id"> | RoomTypeModel) => {
    try {
      if ("id" in data && data.id) {
        await handleUpdate(data.id, data);
        showToast("Cập nhật loại phòng thành công!");
      } else {
        await handleCreate(data);
        showToast("Thêm mới loại phòng thành công!");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Có lỗi xảy ra khi lưu", "error");
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa loại phòng này?")) return;
    try {
      await handleDelete(id);
      showToast("Xóa loại phòng thành công!");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Không thể xóa", "error");
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
          <h1 className="text-2xl font-bold text-gray-800">Danh mục loại phòng</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý các loại phòng và thiết lập giá</p>
        </div>
      </div>

      {/* Search + Actions */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Tìm theo tên loại phòng..."
            value={search} onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Thêm loại phòng
        </button>
      </div>

      {/* Table */}
      <RoomTypeTable
        roomTypes={visibleRoomTypes}
        onEdit={(rt) => { setEditing(rt); setModalOpen(true); }}
        onDelete={handleDeleteConfirm}
      />

      {/* Load more */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Đang hiển thị {visibleRoomTypes.length} / {filtered.length} loại phòng
          </p>
          <button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition">
            Xem thêm 10 loại phòng
          </button>
        </div>
      )}

      {modalOpen && (
        <RoomTypeModal
          roomType={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
