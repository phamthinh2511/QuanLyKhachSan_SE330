"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { name: "Đang ở", value: 105, color: "#f59e0b" },
  { name: "Có thể sử dụng", value: 45, color: "#10b981" },
  { name: "Đã đặt", value: 12, color: "#3b82f6" },
  { name: "Bảo trì", value: 8, color: "#ef4444" },
];

export default function RoomStatusChart() {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-1">Phân bố tình trạng phòng</h3>
      <p className="text-gray-400 text-xs mb-4">Tình trạng hiện tại của các phòng</p>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value">
            {data.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}