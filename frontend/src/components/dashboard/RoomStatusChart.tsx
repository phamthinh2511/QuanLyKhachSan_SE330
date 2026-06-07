"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Room } from "@/types/room";

interface Props {
  rooms: Room[];
}

export default function RoomStatusChart({ rooms }: Props) {
  const occupiedCount = rooms.filter(r => r.status === "Đang sử dụng").length;
  const vacantCount = rooms.filter(r => r.status === "Trống").length;
  const bookedCount = rooms.filter(r => r.status === "Đã đặt").length;
  const maintenanceCount = rooms.filter(r => r.status === "Bảo trì").length;

  const data = [
    { name: "Đang ở", value: occupiedCount, color: "#f59e0b" },
    { name: "Có thể sử dụng", value: vacantCount, color: "#10b981" },
    { name: "Đã đặt", value: bookedCount, color: "#3b82f6" },
    { name: "Bảo trì", value: maintenanceCount, color: "#ef4444" },
  ];

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