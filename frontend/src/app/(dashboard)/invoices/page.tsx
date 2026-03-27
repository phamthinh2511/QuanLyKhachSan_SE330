"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { mockInvoices } from "@/lib/data/invoices";
import { Invoice } from "@/types/invoice";
import InvoiceStatCards from "@/components/invoices/InvoiceStatCards";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceModal from "@/components/invoices/InvoiceModal";
import InvoiceDetailModal from "@/components/invoices/InvoiceDetailModal";

const PAGE_SIZE = 50;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [generateOpen, setGenerateOpen] = useState(false);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      inv.invoiceCode.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase()) ||
      inv.bookingCode.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tất cả" || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const visibleInvoices = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilter(val); setVisibleCount(PAGE_SIZE); };

  const handleGenerate = (invoice: Invoice) => {
    const newId = invoices.length > 0 ? Math.max(...invoices.map((i) => i.id)) + 1 : 1;
    const year = new Date().getFullYear();
    const code = `INV-${year}-${String(newId).padStart(3, "0")}`;
    setInvoices((prev) => [...prev, { ...invoice, id: newId, invoiceCode: code }]);
    setGenerateOpen(false);
  };

  const handleDelete = (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <div className="p-6 rounded-lg bg-white shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin</p>
        </div>
      </div>

      {/* Stat Cards */}
      <InvoiceStatCards invoices={invoices} />

      {/* Search + Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn, khách hàng, booking..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setGenerateOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
        >
          <Plus className="w-4 h-4" />
          Tạo hóa đơn
        </button>
        <select
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Partial</option>
        </select>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={visibleInvoices}
        onView={(inv) => setDetailInvoice(inv)}
        onDelete={handleDelete}
      />

      {hasMore && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-gray-400">
            Đang hiển thị {visibleInvoices.length} / {filtered.length} hóa đơn
          </p>
          <button
            onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition"
          >
            Xem thêm 50 hóa đơn
          </button>
        </div>
      )}

      {/* Generate Modal */}
      {generateOpen && (
        <InvoiceModal
          onSave={handleGenerate}
          onClose={() => setGenerateOpen(false)}
        />
      )}

      {/* Detail + PDF Modal */}
      {detailInvoice && (
        <InvoiceDetailModal
          invoice={detailInvoice}
          onClose={() => setDetailInvoice(null)}
        />
      )}
    </div>
  );
}