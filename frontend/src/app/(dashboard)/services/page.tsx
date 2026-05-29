"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useServices } from "@/hooks/useServices";
import { Service } from "@/types/service";
import ServiceStatCards from "@/components/services/ServiceStatCards";
import ServiceGrid from "@/components/services/ServiceGrid";
import ServiceTable from "@/components/services/ServiceTable";
import ServiceModal from "@/components/services/ServiceModal";

const PAGE_SIZE = 10;

export default function ServicesPage() {
  const {
    services, loading, error,
    handleCreate, handleUpdate, handleDelete, // ← từ hook
  } = useServices();

  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const filtered = services.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceCode.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const visibleServices = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };

  // ← Gộp thành 1 hàm duy nhất, xóa handleDelete cũ
  const handleSave = async (data: Service) => {
    try {
      const { id, serviceCode, ...rest } = data;
      if (editing) {
        await handleUpdate(editing.id, rest);
      } else {
        await handleCreate(rest);
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Có lỗi xảy ra");
    }
  };

  const handleDeleteConfirm = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa dịch vụ này?")) return;
    try {
      await handleDelete(id); // ← dùng handleDelete từ hook
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xóa");
    }
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setModalOpen(true);
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
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm item-start sm:flex sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý dịch vụ</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition h-10"
        >
          <Plus className="w-4 h-4" />
          Thêm dịch vụ
        </button>
      </div>

      {/* Stat Cards */}
      <ServiceStatCards services={services} />

      {/* Grid Cards */}
      <ServiceGrid
        services={services}
        onEdit={handleEdit}
        onDelete={handleDeleteConfirm} // ← đổi thành handleDeleteConfirm
      />

      {/* Search + Filter + Table */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo tên dịch vụ hoặc mã..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <ServiceTable
          services={visibleServices}
          onEdit={handleEdit}
          onDelete={handleDeleteConfirm} // ← đổi thành handleDeleteConfirm
        />

        {hasMore && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              Đang hiển thị {visibleServices.length} / {filtered.length} dịch vụ
            </p>
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-xl transition"
            >
              Xem thêm 10 dịch vụ
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <ServiceModal
          service={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}