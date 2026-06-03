"use client";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { mockServiceUsages } from "@/lib/data/serviceusages";
import { mockServices } from "@/lib/data/services";

export default function ServiceUsageReport() {
  // Tổng hợp theo tên dịch vụ
  const serviceMap: Record<string, { count: number; revenue: number }> = {};
  mockServiceUsages.forEach((u) => {
    if (!serviceMap[u.serviceName]) serviceMap[u.serviceName] = { count: 0, revenue: 0 };
    serviceMap[u.serviceName].count   += u.quantity;
    serviceMap[u.serviceName].revenue += u.total;
  });

  const pieData = Object.entries(serviceMap).map(([name, v]) => ({ name, value: v.count }));
  const barData = Object.entries(serviceMap).map(([name, v]) => ({ name, revenue: v.revenue }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Tỷ lệ sử dụng dịch vụ</h3>
        <p className="text-gray-400 text-xs mb-4">Phân bổ theo số lượt sử dụng</p>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={pieData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}>
              {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Doanh thu theo dịch vụ</h3>
        <p className="text-gray-400 text-xs mb-4">Tổng doanh thu từng dịch vụ</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={barData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v: any) => v >= 1000000 ? `${(v / 1000000).toFixed(1).replace(/\.0$/, "")}M` : v >= 1000 ? `${(v / 1000).toFixed(1).replace(/\.0$/, "")}k` : v} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={100} />
            <Tooltip formatter={(v: any) => `${Number(v).toLocaleString()} VNĐ`} />
            <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" radius={[0,4,4,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}