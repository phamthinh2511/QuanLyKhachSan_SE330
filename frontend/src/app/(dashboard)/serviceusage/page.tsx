"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useServiceUsage } from "@/hooks/useServiceUsage";
import { useToast } from "@/context/ToastContext";
import { ServiceUsage, ServiceUsageStatus } from "@/types/serviceUsage";
import ServiceUsageStatCards from "@/components/serviceusages/ServiceUsageStatCards";
import ServiceUsageTodayTable from "@/components/serviceusages/ServiceUsageTodayTable";
import ServiceUsageAllTable from "@/components/serviceusages/ServiceUsageAllTable";
import ServiceUsageModal from "@/components/serviceusages/ServiceUsageModal";

const today = new Date().toISOString().split("T")[0];
const PAGE_SIZE = 50;

export default function ServiceUsagePage() {
  const { usages, loading, error, saveUsage, removeUsage } = useServiceUsage();
  const { showToast } = useToast();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceUsage | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    usage: ServiceUsage;
  } | null>(null);

  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  const handleRowContextMenu = (e: React.MouseEvent, usage: ServiceUsage) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      usage,
    });
  };

  const handleUpdateStatus = async (id: number, usage: ServiceUsage, newStatus: "Đã sử dụng" | "Đã hủy") => {
    const payload = {
      bookingCode: usage.bookingCode,
      roomNumber: usage.roomNumber,
      serviceName: usage.serviceName,
      quantity: usage.quantity,
      unitPrice: usage.unitPrice,
      total: usage.total,
      date: usage.date,
      status: newStatus,
    };
    try {
      await saveUsage(id, payload);
      showToast("Cập nhật trạng thái thành công!");
    } catch (err: any) {
      showToast(err.message || "Không thể cập nhật trạng thái", "error");
    }
  };

  // Hôm nay — không filter, không phân trang
  const todayUsages = usages.filter((u) => u.date === today);

  // Tất cả — search + filter + load more
  const allFiltered = usages.filter((u) => {
    const matchSearch =
      (u.usageCode?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.bookingCode?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.customerName?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (u.serviceName?.toLowerCase() || "").includes(search.toLowerCase());
    const matchStatus = filterStatus === "Tất cả" || u.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const visibleAll = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilterStatus(val); setVisibleCount(PAGE_SIZE); };

  const handleSave = async (data: ServiceUsage) => {
    const payload = {
      bookingCode: data.bookingCode,
      roomNumber: data.roomNumber,
      serviceName: data.serviceName,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      total: data.total,
      date: data.date,
      status: data.status,
    };
    try {
      await saveUsage(editing ? editing.id : null, payload);
      showToast(editing ? "Cập nhật sử dụng dịch vụ thành công!" : "Ghi nhận sử dụng dịch vụ thành công!");
      setModalOpen(false);
      setEditing(null);
    } catch (err: any) {
      showToast(err.message || "Không thể lưu thông tin sử dụng dịch vụ", "error");
    }
  };

  const handleEdit = (usage: ServiceUsage) => {
    setEditing(usage);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa bản ghi này?")) {
      try {
        await removeUsage(id);
        showToast("Xóa bản ghi sử dụng dịch vụ thành công!");
      } catch (err: any) {
        showToast(err.message || "Không thể xóa bản ghi sử dụng dịch vụ", "error");
      }
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

      {loading && usages.length === 0 ? (
        <div className="p-12 text-center text-gray-400 text-sm">Đang đồng bộ dữ liệu sử dụng dịch vụ...</div>
      ) : (
        <>
          {/* Hôm nay */}
          <ServiceUsageTodayTable
            usages={todayUsages}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRowContextMenu={handleRowContextMenu}
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
              onRowContextMenu={handleRowContextMenu}
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
        </>
      )}

      {modalOpen && (
        <ServiceUsageModal
          usage={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}

      {contextMenu && (
        <div
          className="fixed bg-white border border-gray-200 rounded-2xl shadow-xl py-2 z-50 min-w-[190px] overflow-hidden"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-4 py-1.5 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Dịch vụ: {contextMenu.usage.usageCode}
          </div>
          {contextMenu.usage.status === "Chờ sử dụng" ? (
            <div className="p-1 space-y-0.5">
              <button
                onClick={() => { handleUpdateStatus(contextMenu.usage.id, contextMenu.usage, "Đã sử dụng"); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-green-700 hover:bg-green-50 rounded-lg transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-green-500" />
                Đổi sang Đã sử dụng
              </button>
              <button
                onClick={() => { handleUpdateStatus(contextMenu.usage.id, contextMenu.usage, "Đã hủy"); setContextMenu(null); }}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-red-500" />
                Đổi sang Đã hủy
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 text-xs text-gray-400 text-center italic">Không khả dụng nhanh</div>
          )}
        </div>
      )}
    </div>
  );
}