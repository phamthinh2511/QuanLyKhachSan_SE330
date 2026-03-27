"use client";

import { useState, useRef } from "react";
import { Download } from "lucide-react";
import ReportStatCards from "@/components/reports/ReportStatCards";
import ReportTabs from "@/components/reports/ReportTabs";
import { monthlyData, quarterlyData, thisMonthData } from "@/lib/data/reports";

export type Period = "This Month" | "This Quarter" | "This Year";
export type ReportTab = "Revenue Analysis" | "Occupancy Rate" | "Service Usage" | "Room Performance";

const periodData = {
  "This Month":   thisMonthData,
  "This Quarter": quarterlyData,
  "This Year":    monthlyData,
};

const periodStats = {
  "This Month": {
    revenue: 76000, revenueChange: "+8.3%",
    profit:  40000, profitChange:  "+11.2%",
    occupancy: 82,  occupancyChange: "+5.1%",
    guests:  348,   guestsChange:  "+7.4%",
    expenses: 36000,
  },
  "This Quarter": {
    revenue: 198000, revenueChange: "+10.5%",
    profit:  101000, profitChange:  "+15.8%",
    occupancy: 77,   occupancyChange: "+3.2%",
    guests:  921,    guestsChange:  "+6.1%",
    expenses: 97000,
  },
  "This Year": {
    revenue: 757000, revenueChange: "+12.5%",
    profit:  391000, profitChange:  "+18.2%",
    occupancy: 78,   occupancyChange: "+5.8%",
    guests:  2845,   guestsChange:  "+9.3%",
    expenses: 366000,
  },
};

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("This Year");
  const [activeTab, setActiveTab] = useState<ReportTab>("Revenue Analysis");
  const [periodOpen, setPeriodOpen] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const stats = periodStats[period];
  const data  = periodData[period];

  const handleExport = async () => {
    const { default: jsPDF }      = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      scale: 2, useCORS: true, backgroundColor: "#ffffff",
    });
    const imgData  = canvas.toDataURL("image/png");
    const pdf      = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pdfW     = pdf.internal.pageSize.getWidth();
    const pdfH     = (canvas.height * pdfW) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
    pdf.save(`Hotel-Report-${period.replace(" ", "-")}.pdf`);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
          <p className="text-gray-500 text-sm mt-0.5">Phân tích và thông tin chi tiết về hiệu suất khách sạn</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPeriodOpen(!periodOpen)}
              className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition min-w-[140px] justify-between"
            >
              {period}
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {periodOpen && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 min-w-[160px] overflow-hidden">
                {(["This Month", "This Quarter", "This Year"] as Period[]).map((p) => (
                  <button key={p} onClick={() => { setPeriod(p); setPeriodOpen(false); }}
                    className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-gray-50 transition
                      ${period === p ? "text-blue-600 font-medium" : "text-gray-700"}`}>
                    {p}
                    {period === p && (
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export */}
          <button onClick={handleExport}
            className="flex items-center gap-2 border border-gray-200 bg-white text-gray-700 text-sm px-4 py-2.5 rounded-xl hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Nội dung xuất PDF */}
      <div ref={reportRef} className="space-y-6 bg-white">
        {/* Stat Cards */}
        <ReportStatCards stats={stats} />

        {/* Tabs + Charts */}
        <ReportTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          data={data}
          stats={stats}
          period={period}
        />
      </div>
    </div>
  );
}