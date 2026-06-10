"use client";

import { useState, useEffect, useCallback } from "react";
import { Invoice } from "@/types/invoice";
import InvoiceStatCards from "@/components/invoices/InvoiceStatCards";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceDetailModal from "@/components/invoices/InvoiceDetailModal";
import InvoiceEditModal from "@/components/invoices/InvoiceEditModal";
import { getPagedInvoices, deleteInvoice, updateInvoice, exportInvoices } from "@/lib/api/invoices";
import { Download, Calendar, Search, ChevronDown } from "lucide-react";
import { useToast } from "@/context/ToastContext";

const PAGE_SIZE = 15;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Chờ thanh toán"); // Status filter
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalElements, setTotalElements] = useState(0);
  const [stats, setStats] = useState({
    totalCount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  // Time filters
  const [timeOption, setTimeOption] = useState<string>("this-month"); // "this-month", "last-month", "custom", "all"
  const [customMonth, setCustomMonth] = useState<number>(new Date().getMonth() + 1);
  const [customYear, setCustomYear] = useState<number>(new Date().getFullYear());

  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const { showToast } = useToast();

  // Generate list of years for selector (from 5 years ago to 5 years in the future)
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i);
  // List of months
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // Helper to determine year and month params
  const getFilterDateParams = (option: string, cMonth: number, cYear: number) => {
    const now = new Date();
    if (option === "this-month") {
      return { year: now.getFullYear(), month: now.getMonth() + 1 };
    }
    if (option === "last-month") {
      let m = now.getMonth();
      let y = now.getFullYear();
      if (m === 0) {
        m = 12;
        y = y - 1;
      }
      return { year: y, month: m };
    }
    if (option === "custom") {
      return { year: cYear, month: cMonth };
    }
    return { year: undefined, month: undefined }; // 'all'
  };

  // Helper to get time label for display
  const getMonthLabel = () => {
    const { year, month } = getFilterDateParams(timeOption, customMonth, customYear);
    if (year && month) {
      return `Tháng ${month}/${year}`;
    }
    return "Tất cả thời gian";
  };

  // Fetch invoices from backend
  const fetchInvoices = useCallback((pageToFetch: number, searchKeyword: string, statusFilter: string, append = false) => {
    setLoading(true);
    const { year, month } = getFilterDateParams(timeOption, customMonth, customYear);
    // "Chờ thanh toán" → ngày tạo tăng dần, mặc định → giảm dần
    const sortDir = statusFilter === "Chờ thanh toán" ? "asc" : "desc";

    getPagedInvoices({
      year,
      month,
      search: searchKeyword,
      status: statusFilter,
      sortDir,
      page: pageToFetch,
      size: PAGE_SIZE,
    })
      .then((data) => {
        if (append) {
          setInvoices((prev) => [...prev, ...(data.content || [])]);
        } else {
          setInvoices(data.content || []);
        }
        setStats({
          totalCount: data.totalCount,
          paidAmount: data.paidAmount,
          pendingAmount: data.pendingAmount,
        });
        setTotalElements(data.totalElements);
        setHasMore(!data.last && data.content && data.content.length > 0);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Không thể kết nối tới máy chủ.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [timeOption, customMonth, customYear]);

  // Initial fetch and fetch when filters change
  useEffect(() => {
    setPage(0);
    fetchInvoices(0, search, filter, false);
  }, [timeOption, customMonth, customYear, filter, fetchInvoices]);

  // Handle Search
  const handleSearch = (val: string) => {
    setSearch(val);
    setPage(0);
    fetchInvoices(0, val, filter, false);
  };

  // Handle Filter by Status
  const handleFilter = (val: string) => {
    setFilter(val);
    setPage(0);
    fetchInvoices(0, search, val, false);
  };

  // Load more pages
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchInvoices(nextPage, search, filter, true);
  };

  // Re-fetch current state
  const handleRefresh = () => {
    setPage(0);
    fetchInvoices(0, search, filter, false);
  };

  const handleUpdate = async (updatedInvoice: Invoice) => {
    try {
      await updateInvoice(updatedInvoice.id, updatedInvoice);
      showToast("Cập nhật hóa đơn thành công!");
      handleRefresh();
      setEditingInvoice(null);
    } catch (err: any) {
      showToast(err.message || "Cập nhật hóa đơn thất bại!", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      try {
        await deleteInvoice(id);
        showToast("Xóa hóa đơn thành công!");
        handleRefresh();
      } catch (err: any) {
        showToast(err.message || "Xóa hóa đơn thất bại!", "error");
      }
    }
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const { year, month } = getFilterDateParams(timeOption, customMonth, customYear);
      const blob = await exportInvoices(year, month);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `danh_sach_hoa_don_${getMonthLabel().replace(/[\s/]/g, "_")}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      showToast(err.message || "Xuất file Excel thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Embedded Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Header */}
      <div>
        <div className="p-6 rounded-lg bg-white shadow-sm flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý hóa đơn</h1>
            <p className="text-gray-500 text-sm">Welcome back, Admin</p>
          </div>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Download className="w-4 h-4" />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <InvoiceStatCards
        totalCount={stats.totalCount}
        paidAmount={stats.paidAmount}
        pendingAmount={stats.pendingAmount}
        monthLabel={getMonthLabel()}
      />

      {/* Search + Filter */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm theo mã hóa đơn, khách hàng, booking..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 hover:bg-gray-50 transition"
          />
        </div>

        {/* Custom Month Picker / Time Selector */}
        <div className="flex gap-2 items-center w-full md:w-auto">
          <div className="relative w-full md:w-44">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <select
              value={timeOption}
              onChange={(e) => setTimeOption(e.target.value)}
              className="w-full pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition appearance-none"
            >
              <option value="this-month">Tháng này</option>
              <option value="last-month">Tháng trước</option>
              <option value="custom">Chọn tháng...</option>
              <option value="all">Tất cả</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Sub Month & Year pickers revealed when "custom" selected */}
          {timeOption === "custom" && (
            <div className="flex gap-1.5 animate-fadeIn">
              <div className="relative w-24">
                <select
                  value={customMonth}
                  onChange={(e) => setCustomMonth(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition appearance-none text-center"
                >
                  {months.map((m) => (
                    <option key={m} value={m}>Tháng {m}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative w-24">
                <select
                  value={customYear}
                  onChange={(e) => setCustomYear(Number(e.target.value))}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition appearance-none text-center"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          )}
        </div>

        {/* Status Dropdown */}
        <div className="relative w-full md:w-44">
          <select
            value={filter}
            onChange={(e) => handleFilter(e.target.value)}
            className="w-full pl-4 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:bg-gray-50 transition appearance-none"
          >
            <option value="Tất cả">Trạng thái: Tất cả</option>
            <option value="Đã thanh toán">Đã thanh toán</option>
            <option value="Chờ thanh toán">Chờ thanh toán</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Loading & Error States */}
      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-100 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <InvoiceTable
        invoices={invoices}
        onView={(inv) => setDetailInvoice(inv)}
        onEdit={(inv) => setEditingInvoice(inv)}
        onDelete={handleDelete}
      />

      {/* Load More Button */}
      {hasMore && (
        <div className="flex flex-col items-center gap-2 mt-4">
          <p className="text-sm text-gray-400">
            Đang hiển thị {invoices.length} / {totalElements} hóa đơn
          </p>
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-6 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium rounded-xl transition shadow-sm disabled:opacity-50"
          >
            {loading ? "Đang tải..." : "Xem thêm hóa đơn"}
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editingInvoice && (
        <InvoiceEditModal
          invoice={editingInvoice}
          onSave={handleUpdate}
          onClose={() => setEditingInvoice(null)}
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