"use client";

import { ReportTab, Period } from "@/app/(dashboard)/reports/page";
import RevenueAnalysis from "./tabs/RevenueAnalysis";
import OccupancyRate from "./tabs/OccupancyRate";
import ServiceUsageReport from "./tabs/ServiceUsageReport";
import RoomPerformance from "./tabs/RoomPerformance";

const TABS: ReportTab[] = ["Revenue Analysis", "Occupancy Rate", "Service Usage", "Room Performance"];

interface Props {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  data: { labels: string[]; revenue: number[]; profit: number[]; occupancy: number[]; guests: number[] };
  stats: { revenue: number; profit: number; occupancy: number; guests: number; expenses: number };
  period: Period;
}

export default function ReportTabs({ activeTab, onTabChange, data, stats, period }: Props) {
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
      {activeTab === "Revenue Analysis"  && <RevenueAnalysis  data={data} stats={stats} />}
      {activeTab === "Occupancy Rate"    && <OccupancyRate    data={data} />}
      {activeTab === "Service Usage"     && <ServiceUsageReport />}
      {activeTab === "Room Performance"  && <RoomPerformance />}
    </div>
  );
}