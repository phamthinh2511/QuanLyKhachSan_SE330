"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { mockServiceUsages } from "@/lib/data/serviceusages";
import { ServiceUsage, ServiceUsageStatus } from "@/types/serviceUsage";
import ServiceUsageStatCards from "@/components/serviceusages/ServiceUsageStatCards";
import ServiceUsageTodayTable from "@/components/serviceusages/ServiceUsageTodayTable";
import ServiceUsageAllTable from "@/components/serviceusages/ServiceUsageAllTable";
import ServiceUsageModal from "@/components/serviceusages/ServiceUsageModal";

const today = new Date().toISOString().split("T")[0];
const PAGE_SIZE = 50;

export default function ServiceUsagePage() {
  const [usages, setUsages] = useState<ServiceUsage[]>(mockServiceUsages);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceUsage | null>(null);

  // Hôm nay — không filter, không phân trang
  const todayUsages = usages.filter((u) => u.date === today);

  // Tất cả — search + filter + load more
  const allFiltered = usages.filter((u) => {
    const matchSearch =
      u.usageCode.toLowerCase().includes(search.toLowerCase()) ||
      u.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
      u.customerName.toLowerCase().includes(search.toLowerCase()) ||
      u.serviceName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const visibleAll = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilterStatus(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = (data: ServiceUsage) => {
    if (editing) {
      setUsages((prev) => prev.map((u) => (u.id === data.id ? data : u)));
    } else {
      const newId = usages.length > 0 ? Math.max(...usages.map((u) => u.id)) + 1 : 1;
      const newCode = `SU-${String(newId).padStart(3, "0")}`;
      setUsages((prev) => [...prev, { ...data, id: newId, usageCode: newCode }]);
    }
    setModalOpen(false);
    setEditing(null);
  };

  const handleEdit = (usage: ServiceUsage) => {
    setEditing(usage);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      setUsages((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm item-start sm:flex sm:justify-between">
          <div><h1 className="text-2xl font-bold text-gray-800">Quản lý sử dụng dịch vụ</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
          </div>
    </div>
      {/* Stat Cards — tháng này */}
      <ServiceUsageStatCards usages={usages} />

      {/* Hôm nay */}
      <ServiceUsageTodayTable
        usages={todayUsages}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
  
      {/* Tất cả */}
      <div className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Tìm theo mã, booking, khách hàng, dịch vụ..."
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
          Ghi nhận dịch vụ
        </button>
          <select
            value={filterStatus}
            onChange={(e) => handleFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Tất cả</option>
            <option>Đã sử dụng</option>
            <option>Chờ sử dụng</option>
            <option>Đã hủy</option>
          </select>
        </div>

        <ServiceUsageAllTable
          usages={visibleAll}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {hasMore && (
          <div className="flex flex-col items-center gap-2">
            <p className="text-sm text-gray-400">
              Đang hiển thị {visibleAll.length} / {allFiltered.length} bản ghi
            </p>
            <button
              onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
              className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 text-sm font-medium rounded-xl transition"
            >
              Xem thêm 50 bản ghi
            </button>
          </div>
        )}
      </div>

      {modalOpen && (
        <ServiceUsageModal
          usage={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
}