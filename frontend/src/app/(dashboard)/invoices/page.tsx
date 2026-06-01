"use client";

import { useState, useEffect } from "react";
import { Invoice } from "@/types/invoice";
import InvoiceStatCards from "@/components/invoices/InvoiceStatCards";
import InvoiceTable from "@/components/invoices/InvoiceTable";
import InvoiceDetailModal from "@/components/invoices/InvoiceDetailModal";
import InvoiceEditModal from "@/components/invoices/InvoiceEditModal";
import CheckoutModal from "@/components/invoices/CheckoutModal";
import { getAllInvoices, deleteInvoice, updateInvoice } from "@/lib/api/invoices";

const PAGE_SIZE = 50;

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Tất cả");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [detailInvoice, setDetailInvoice] = useState<Invoice | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [checkoutInvoice, setCheckoutInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = () => {
    setLoading(true);
    getAllInvoices()
      .then((data) => {
        setInvoices(data || []);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Không thể kết nối tới máy chủ.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matchSearch =
      (inv.invoiceCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.customerName || "").toLowerCase().includes(search.toLowerCase()) ||
      (inv.bookingCode || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "Tất cả" || inv.status === filter;
    return matchSearch && matchFilter;
  });

  const visibleInvoices = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const handleSearch = (val: string) => { setSearch(val); setVisibleCount(PAGE_SIZE); };
  const handleFilter = (val: string) => { setFilter(val); setVisibleCount(PAGE_SIZE); };

  const handleUpdate = async (updatedInvoice: Invoice) => {
    try {
      await updateInvoice(updatedInvoice.id, updatedInvoice);
      alert("Cập nhật hóa đơn thành công!");
      fetchInvoices();
      setEditingInvoice(null);
    } catch (err: any) {
      alert(err.message || "Cập nhật hóa đơn thất bại!");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Bạn có chắc muốn xóa hóa đơn này?")) {
      try {
        await deleteInvoice(id);
        alert("Xóa hóa đơn thành công!");
        fetchInvoices();
      } catch (err: any) {
        alert(err.message || "Xóa hóa đơn thất bại!");
      }
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
        <select
          value={filter}
          onChange={(e) => handleFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option>Tất cả</option>
          <option>Đã thanh toán</option>
          <option>Chờ thanh toán</option>
          <option>Một phần</option>
        </select>
      </div>

      {/* Table */}
      <InvoiceTable
        invoices={visibleInvoices}
        onView={(inv) => setDetailInvoice(inv)}
        onEdit={(inv) => setEditingInvoice(inv)}
        onDelete={handleDelete}
        onCheckout={(inv) => setCheckoutInvoice(inv)}
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

      {/* Checkout Modal */}
      {checkoutInvoice && (
        <CheckoutModal
          maPhieuThue={parseInt(checkoutInvoice.bookingCode) || 0}
          maPhong={parseInt(checkoutInvoice.roomNumber) || 0}
          maNhanVien={1}
          khachHang={checkoutInvoice.customerName}
          onSuccess={(result) => {
            alert(`Checkout thành công! Mã hóa đơn: #${result.maHoaDon}`);
            fetchInvoices();
            setCheckoutInvoice(null);
          }}
          onClose={() => setCheckoutInvoice(null)}
        />
      )}
    </div>
  );
}