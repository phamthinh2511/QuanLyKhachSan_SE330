"use client";

import { ReportTab, Period } from "@/app/(dashboard)/reports/page";
import RevenueAnalysis from "./tabs/RevenueAnalysis";
import OccupancyRate from "./tabs/OccupancyRate";
import ServiceUsageReport from "./tabs/ServiceUsageReport";
import RoomPerformance from "./tabs/RoomPerformance";

const TABS: ReportTab[] = ["Phân tích doanh thu", "Tỉ lệ bận phòng", "Sử dụng dịch vụ", "Năng suất phòng"];

interface Props {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  data: { labels: string[]; revenue: number[]; profit: number[]; occupancy: number[]; guests: number[] };
  stats: { revenue: number; profit: number; occupancy: number; guests: number; expenses: number };
  period: Period;
  filterType: "month" | "quarter" | "year";
  selectedYear: number;
  selectedValue: number;
}

export default function ReportTabs({ activeTab, onTabChange, data, stats, period, filterType, selectedYear, selectedValue }: Props) {
  return (
    <div className="space-y-4">
      {/* Tab buttons */}
      <div className="flex gap-2 bg-white border border-gray-100 rounded-2xl p-1.5 w-fit">
        {TABS.map((tab) => (
          <button key={tab} onClick={() => onTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-xl transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "Phân tích doanh thu"  && <RevenueAnalysis  data={data} stats={stats} />}
      {activeTab === "Tỉ lệ bận phòng"    && <OccupancyRate    data={data} />}
      {activeTab === "Sử dụng dịch vụ"     && (
        <ServiceUsageReport
          filterType={filterType}
          selectedYear={selectedYear}
          selectedValue={selectedValue}
        />
      )}
      {activeTab === "Năng suất phòng"  && <RoomPerformance />}
    </div>
  );
}