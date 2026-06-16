"use client";

import { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { getServiceUsages } from "@/lib/api/service-usages";
import { ServiceUsage } from "@/types/serviceUsage";

interface Props {
  filterType: "month" | "quarter" | "year";
  selectedYear: number;
  selectedValue: number;
}

export default function ServiceUsageReport({ filterType, selectedYear, selectedValue }: Props) {
  const [usages, setUsages] = useState<ServiceUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getServiceUsages()
      .then((data) => {
        setUsages(data || []);
      })
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu sử dụng dịch vụ:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <div className="text-gray-500 text-sm flex flex-col items-center gap-2">
          <svg className="animate-spin h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Đang tải dữ liệu sử dụng dịch vụ...</span>
        </div>
      </div>
    );
  }

  // Lọc dữ liệu theo thời gian được chọn
  const filteredUsages = usages.filter((u) => {
    if (u.status === "Đã hủy") return false;
    if (!u.date) return false;

    // Định dạng ngày: YYYY-MM-DD
    const parts = u.date.split("-");
    if (parts.length < 3) return false;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);

    if (year !== selectedYear) return false;

    if (filterType === "month") {
      return month === selectedValue;
    } else if (filterType === "quarter") {
      const qStart = (selectedValue - 1) * 3 + 1;
      const qEnd = qStart + 2;
      return month >= qStart && month <= qEnd;
    } else {
      // year
      return true;
    }
  });

  // Tổng hợp theo tên dịch vụ
  const serviceMap: Record<string, { count: number; revenue: number }> = {};
  filteredUsages.forEach((u) => {
    if (!serviceMap[u.serviceName]) {
      serviceMap[u.serviceName] = { count: 0, revenue: 0 };
    }
    serviceMap[u.serviceName].count += u.quantity;
    serviceMap[u.serviceName].revenue += u.total;
  });

  const pieData = Object.entries(serviceMap).map(([name, v]) => ({ name, value: v.count }));
  const barData = Object.entries(serviceMap).map(([name, v]) => ({ name, revenue: v.revenue }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

  if (pieData.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <svg className="w-16 h-16 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-gray-500 font-medium">Không có dữ liệu sử dụng dịch vụ</p>
        <p className="text-gray-400 text-xs mt-1">Vui lòng chọn khoảng thời gian khác hoặc tạo thêm giao dịch sử dụng dịch vụ.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fadeIn">
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
            <Bar dataKey="revenue" name="Doanh thu" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}