"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ReportData } from "@/lib/api/invoices";

interface Props {
  reportData: ReportData | null;
}

export default function RevenueChart({ reportData }: Props) {
  const chartData = reportData && reportData.chartData
    ? reportData.chartData.labels.map((label, idx) => ({
        month: label,
        revenue: reportData.chartData.revenue[idx] || 0,
        bookings: reportData.chartData.guests[idx] || 0,
      }))
    : [
        { month: "Th1", revenue: 0, bookings: 0 },
        { month: "Th2", revenue: 0, bookings: 0 },
        { month: "Th3", revenue: 0, bookings: 0 },
        { month: "Th4", revenue: 0, bookings: 0 },
        { month: "Th5", revenue: 0, bookings: 0 },
        { month: "Th6", revenue: 0, bookings: 0 },
        { month: "Th7", revenue: 0, bookings: 0 },
        { month: "Th8", revenue: 0, bookings: 0 },
        { month: "Th9", revenue: 0, bookings: 0 },
        { month: "Th10", revenue: 0, bookings: 0 },
        { month: "Th11", revenue: 0, bookings: 0 },
        { month: "Th12", revenue: 0, bookings: 0 },
      ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-1">Doanh thu và Khách lưu trú</h3>
      <p className="text-gray-400 text-xs mb-4">Theo tháng (Năm hiện tại)</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => typeof value === "number" ? value.toLocaleString("vi-VN") : value} />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Doanh thu (VND)" />
          <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Khách lưu trú" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}