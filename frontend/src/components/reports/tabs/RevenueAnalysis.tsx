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

  const margin = stats.revenue > 0 ? Math.round((stats.profit / stats.revenue) * 100) : 0;

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
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} />
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
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: any) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" name="Doanh thu"
                stroke="#3b82f6" strokeWidth={2} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Tóm tắt tài chính</h3>
        <p className="text-gray-400 text-xs mb-5">Tổng quan tài chính từ đầu năm đến nay</p>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm mb-1">Tổng doanh thu</p>
            <p className="text-2xl font-bold text-blue-600">${stats.revenue.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">Từ tất cả các nguồn thu</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Tổng chi phí</p>
            <p className="text-2xl font-bold text-red-500">${stats.expenses.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">Chi phí vận hành</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm mb-1">Lợi nhuận ròng</p>
            <p className="text-2xl font-bold text-green-600">${stats.profit.toLocaleString()}</p>
            <p className="text-gray-400 text-xs mt-1">Biên lợi nhuận: {margin}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}