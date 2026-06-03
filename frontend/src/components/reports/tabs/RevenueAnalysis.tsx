"use client";

import {
  BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

interface Props {
  data: { labels: string[]; revenue: number[]; profit: number[] };
  stats: { revenue: number; profit: number; expenses: number };
}

export default function RevenueAnalysis({ data, stats }: Props) {
  const chartData = data.labels.map((label, i) => ({
    label, revenue: data.revenue[i], profit: data.profit[i],
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Bar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Doanh thu & Lợi nhuận hàng tháng</h3>
          <p className="text-gray-400 text-xs mb-4">Xu hướng doanh thu và lợi nhuận</p>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={60} tickFormatter={(v: any) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(/\.0$/, "")}M` : v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : v} />
              <Tooltip formatter={(v: any) => `${v.toLocaleString()} VNĐ`} />
              <Legend />
              <Bar dataKey="revenue" name="Doanh thu" fill="#3b82f6" radius={[4,4,0,0]} />
              <Bar dataKey="profit"  name="Lợi nhuận" fill="#10b981" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Area chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-1">Xu hướng doanh thu</h3>
          <p className="text-gray-400 text-xs mb-4">Mô hình tăng trưởng doanh thu hàng tháng</p>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={60} tickFormatter={(v: any) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(/\.0$/, "")}M` : v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : v} />
              <Tooltip formatter={(v: any) => `${v.toLocaleString()} VNĐ`} />
              <Area type="monotone" dataKey="revenue" name="Doanh thu"
                stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}