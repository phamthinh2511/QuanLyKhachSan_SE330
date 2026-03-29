"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { mockCustomers } from "@/lib/data/customers";
import { useCustomers } from "@/hooks/useCustomers";
import { Customer } from "@/types/customer";
import CustomerTable from "@/components/customers/CustomerTable";
import CustomerModal from "@/components/customers/CustomerModal";

const PAGE_SIZE = 50;

export default function CustomersPage() {
  const { customers, loading, error, handleCreate, handleUpdate, handleDelete } = useCustomers();
  
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE); // 👈 thêm

  const filtered = customers.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search);
    const matchFilter = filter === "Tất cả" || c.status === filter;
    return matchSearch && matchFilter;
  });

  const visibleCustomers = filtered.slice(0, visibleCount); // 👈 thêm
  const hasMore = visibleCount < filtered.length;           // 👈 thêm

  // Reset về 10 khi search/filter thay đổi
  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilter(val); setVisibleCount(PAGE_SIZE); };

   const handleSave = async (data: Customer) => {
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
    if (!confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
    try {
      await handleDelete(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Không thể xóa");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="flex items-center gap-3 text-gray-500">
          <span className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          Đang tải dữ liệu...
        </div>
      </div>
    );
  }

if (error) {
    return (
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
  }

  const handleEdit = (customer: Customer) => {
    setEditing(customer);
    setModalOpen(true);
  };

  const handleView = (customer: Customer) => {
    setEditing(customer);
    setModalOpen(true);
  }
return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="p-6 rounded-lg bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <p className="text-gray-500 text-sm mt-0.5">Quản lý tất cả thông tin khách hàng</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Tìm theo tên, email hoặc số điện thoại..."
            value={search} onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" /> Thêm khách hàng
        </button>
        <select value={filter} onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option>Tất cả</option>
          <option>Thường</option>
          <option>VIP</option>
          <option>Khách hàng thân thiết</option>
        </select>
      </div>

      {/* Table */}
      <CustomerTable
        customers={visibleCustomers}
        onEdit={(c) => { setEditing(c); setModalOpen(true); }}
        onDelete={handleDeleteConfirm}
      />

      {/* Load more */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Đang hiển thị {visibleCustomers.length} / {filtered.length} khách hàng
          </p>
          <button onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition">
            Xem thêm 10 khách hàng
          </button>
        </div>
      )}

      {modalOpen && (
        <CustomerModal
          customer={editing}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditing(null); }}
        />
      )}
    </div>
  );
  
}