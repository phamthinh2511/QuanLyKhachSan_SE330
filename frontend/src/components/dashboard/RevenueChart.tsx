"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { month: "Jan", revenue: 45000, bookings: 2 },
  { month: "Feb", revenue: 52000, bookings: 3 },
  { month: "Mar", revenue: 50000, bookings: 4 },
  { month: "Apr", revenue: 61000, bookings: 3 },
  { month: "May", revenue: 58000, bookings: 2 },
  { month: "Jun", revenue: 68000, bookings: 4 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-1">Hóa đơn và Đặt phòng</h3>
      <p className="text-gray-400 text-xs mb-4">Theo tháng</p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} name="Doanh thu (đ)" />
          <Line type="monotone" dataKey="bookings" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} name="Đặt phòng" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}