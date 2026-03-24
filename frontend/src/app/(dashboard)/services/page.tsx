"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { mockServices } from "@/lib/data/services";
import { Service } from "@/types/service";
import ServiceStatCards from "@/components/services/ServiceStatCards";
import ServiceGrid from "@/components/services/ServiceGrid";
import ServiceTable from "@/components/services/ServiceTable";
import ServiceModal from "@/components/services/ServiceModal";

const PAGE_SIZE = 10;

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);

  const filtered = services.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.serviceCode.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "Tất cả" || s.category === filterCategory;
    return matchSearch && matchCat;
  });

  const visibleServices = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilterCategory(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = (data: Service) => {
    if (editing) {
      setServices((prev) => prev.map((s) => (s.id === data.id ? data : s)));
    } else {
      const newId = services.length > 0 ? Math.max(...services.map((s) => s.id)) + 1 : 1;
      const newCode = `SRV-${String(newId).padStart(3, "0")}`;
      setServices((prev) => [...prev, { ...data, id: newId, serviceCode: newCode }]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (service: Service) => {
    setEditing(service);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa dịch vụ này?")) {
      setServices((prev) => prev.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm item-start sm:flex sm:justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">Quản lý đặt phòng</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p></div>
          
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
        onDelete={handleDelete}
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
          <select
            value={filterCategory}
            onChange={(e) => handleFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Tất cả</option>
            <option>Ăn uống</option>
            <option>Phòng</option>
            <option>Spa</option>
            <option>Đưa đón</option>
            <option>Khác</option>
          </select>
        </div>

        <ServiceTable
          services={visibleServices}
          onEdit={handleEdit}
          onDelete={handleDelete}
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