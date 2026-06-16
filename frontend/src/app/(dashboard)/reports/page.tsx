"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Download, ChevronDown, Calendar } from "lucide-react";
import ReportStatCards from "@/components/reports/ReportStatCards";
import ReportTabs from "@/components/reports/ReportTabs";
import { getReportData, exportRevenueReport, ReportData } from "@/lib/api/invoices";
import { useToast } from "@/context/ToastContext";
import { getUser } from "@/lib/auth";
import CustomSelect from "@/components/ui/CustomSelect";
import PageSkeleton from "@/components/ui/PageSkeleton";
import PageError from "@/components/ui/PageError";

// Module-level cache to persist state across client-side page views
let cachedFilterType: "month" | "quarter" | "year" = "month";
let cachedSelectedYear: number = new Date().getFullYear();
let cachedSelectedValue: number = new Date().getMonth() + 1;
let cachedReportData: ReportData | null = null;

export type Period = string;
export type ReportTab = "Phân tích doanh thu" | "Tỉ lệ bận phòng" | "Sử dụng dịch vụ" | "Năng suất phòng";

export default function ReportsPage() {
  const router = useRouter();
  
  useEffect(() => {
    const user = getUser();
    if (user?.role === "NHAN_VIEN") {
      router.replace("/dashboard");
    }
  }, [router]);

  const [activeTab, setActiveTab] = useState<ReportTab>("Phân tích doanh thu");
  const { showToast } = useToast();
  const reportRef = useRef<HTMLDivElement>(null);

  // Dynamic filter state
  const [filterType, setFilterType] = useState<"month" | "quarter" | "year">(cachedFilterType);
  const [selectedYear, setSelectedYear] = useState<number>(cachedSelectedYear);
  const [selectedValue, setSelectedValue] = useState<number>(cachedSelectedValue);

  const [reportData, setReportData] = useState<ReportData | null>(cachedReportData);
  const [loading, setLoading] = useState(() => !cachedReportData);
  const [error, setError] = useState("");

  // Years options: from 3 years ago to 3 years in the future
  const years = Array.from({ length: 7 }, (_, i) => new Date().getFullYear() - 3 + i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const quarters = [1, 2, 3, 4];

  // Helper to handle filter type changes
  const handleFilterTypeChange = (type: "month" | "quarter" | "year") => {
    setFilterType(type);
    if (type === "month") {
      setSelectedValue(new Date().getMonth() + 1);
    } else if (type === "quarter") {
      setSelectedValue(Math.floor(new Date().getMonth() / 3) + 1);
    } else {
      setSelectedValue(1);
    }
  };

  // Resolve filter label for UI and charts
  const getPeriodLabel = () => {
    if (filterType === "month") return `Tháng ${selectedValue}/${selectedYear}`;
    if (filterType === "quarter") return `Quý ${selectedValue}/${selectedYear}`;
    return `Năm ${selectedYear}`;
  };

  // Fetch report data from backend
  const fetchReport = useCallback((force = false) => {
    if (!cachedReportData || force) {
      setLoading(true);
    }
    setError("");
    getReportData({
      type: filterType,
      year: selectedYear,
      value: filterType !== "year" ? selectedValue : undefined,
    })
      .then((data) => {
        cachedFilterType = filterType;
        cachedSelectedYear = selectedYear;
        cachedSelectedValue = selectedValue;
        cachedReportData = data;
        setReportData(data);
        setError("");
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu báo cáo:", err);
        setError(err.message || "Lỗi tải dữ liệu báo cáo");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filterType, selectedYear, selectedValue]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleExport = async () => {
    const { default: jsPDF }      = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas-pro");
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
    });
    const imgData  = canvas.toDataURL("image/png");
    const pdf      = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pdfW     = pdf.internal.pageSize.getWidth();
    const pdfH     = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`Bao-Cao-Khach-San-${getPeriodLabel().replace(/[\s/]/g, "-")}.pdf`);
  };

  const handleExportExcel = async () => {
    try {
      setLoading(true);
      const blob = await exportRevenueReport({
        type: filterType,
        year: selectedYear,
        value: filterType !== "year" ? selectedValue : undefined,
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const timeLabel = filterType === "month" ? `thang_${selectedValue}` : filterType === "quarter" ? `quy_${selectedValue}` : `nam`;
      a.download = `bao_cao_doanh_thu_${timeLabel}_${selectedYear}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      showToast("Xuất báo cáo doanh thu thành công!");
    } catch (err: any) {
      showToast(err.message || "Xuất báo cáo doanh thu thất bại!", "error");
    } finally {
      setLoading(false);
    }
  };

  const stats = reportData ? {
    revenue: reportData.revenue,
    profit: reportData.profit,
    occupancy: reportData.occupancy,
    guests: reportData.guests,
    expenses: reportData.expenses,
  } : { revenue: 0, profit: 0, occupancy: 0, guests: 0, expenses: 0 };

  const chartData = reportData?.chartData || { labels: [], revenue: [], profit: [], occupancy: [], guests: [] };

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

      {/* Header & Filters */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 text-sm mt-0.5">Phân tích và thông tin chi tiết về hiệu suất khách sạn</p>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Radio-styled tabs for Period Type selection */}
          <div className="flex bg-gray-100 p-1 rounded-xl border border-gray-200/60">
            <button
              onClick={() => handleFilterTypeChange("month")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterType === "month"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Tháng
            </button>
            <button
              onClick={() => handleFilterTypeChange("quarter")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterType === "quarter"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Quý
            </button>
            <button
              onClick={() => handleFilterTypeChange("year")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition ${
                filterType === "year"
                  ? "bg-white text-gray-800 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Năm
            </button>
          </div>

          {/* Selector Dropdowns */}
          <div className="flex gap-2">
            {/* Year Selector */}
            <div className="relative w-32">
              <CustomSelect
                value={String(selectedYear)}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="w-full pl-3 pr-8 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {years.map((y) => (
                  <option key={y} value={String(y)}>Năm {y}</option>
                ))}
              </CustomSelect>
            </div>

            {/* Month value Selector */}
            {filterType === "month" && (
              <div className="relative w-32 animate-fadeIn">
                <CustomSelect
                  value={String(selectedValue)}
                  onChange={(e) => setSelectedValue(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {months.map((m) => (
                    <option key={m} value={String(m)}>Tháng {m}</option>
                  ))}
                </CustomSelect>
              </div>
            )}

            {/* Quarter value Selector */}
            {filterType === "quarter" && (
              <div className="relative w-32 animate-fadeIn">
                <CustomSelect
                  value={String(selectedValue)}
                  onChange={(e) => setSelectedValue(Number(e.target.value))}
                  className="w-full pl-3 pr-8 py-2 border border-gray-200 bg-white rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                >
                  {quarters.map((q) => (
                    <option key={q} value={String(q)}>Quý {q}</option>
                  ))}
                </CustomSelect>
              </div>
            )}
          </div>

          {/* Export Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              disabled={loading}
              className="flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm px-4 py-2 rounded-xl transition font-medium disabled:opacity-50"
            >
              PDF
            </button>
            <button
              onClick={handleExportExcel}
              disabled={loading}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm font-medium disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
          </div>
        </div>
      </div>

      {/* Main Report Dashboard */}
      {error && !reportData ? (
        <PageError message={error} onRetry={() => fetchReport(true)} />
      ) : loading && !reportData ? (
        <PageSkeleton type="reports" />
      ) : (
        <div ref={reportRef} className="space-y-6 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          {/* Report Header for Export/Print */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Báo Cáo Thống Kê Hoạt Động Khách Sạn</h2>
              <p className="text-gray-500 text-sm mt-1">Kỳ báo cáo: <span className="font-semibold text-blue-600">{getPeriodLabel()}</span></p>
            </div>
            <div className="mt-2 sm:mt-0 text-left sm:text-right text-xs text-gray-400">
              <p className="font-semibold text-gray-600">Khách Sạn SE330</p>
              <p>Ngày lập: {new Date().toLocaleDateString("vi-VN")}</p>
            </div>
          </div>

          {/* Stat Cards */}
          <ReportStatCards stats={stats} />

          {/* Tabs + Chart Panels */}
          <div className="mt-4">
            <ReportTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              data={chartData}
              stats={stats}
              period={getPeriodLabel()}
              filterType={filterType}
              selectedYear={selectedYear}
              selectedValue={selectedValue}
            />
          </div>
        </div>
      )}
    </div>
  );
}