"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { mockRooms } from "@/lib/data/rooms";
import { mockBookings } from "@/lib/data/bookings";

export default function RoomPerformance() {
  // Bookings theo loại phòng
  const typeMap: Record<string, number> = {};
  mockBookings.forEach((b) => {
    const room = mockRooms.find((r) => r.roomNumber === b.roomNumber);
    if (!room) return;
    typeMap[room.type] = (typeMap[room.type] ?? 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([type, bookings]) => ({ type, bookings }));

  // Trạng thái phòng
  const statusMap: Record<string, number> = {};
  mockRooms.forEach((r) => { statusMap[r.status] = (statusMap[r.status] ?? 0) + 1; });
  const statusData = Object.entries(statusMap).map(([name, value]) => ({ name, value }));

  const STATUS_COLORS: Record<string, string> = {
    "Trống": "#10b981", "Đang sử dụng": "#f59e0b",
    "Đã đặt": "#3b82f6", "Bảo trì": "#ef4444",
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Booking theo loại phòng</h3>
        <p className="text-gray-400 text-xs mb-4">Số lượt đặt theo từng loại</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={typeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="type" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Bar dataKey="bookings" name="Lượt đặt" fill="#6366f1" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-1">Trạng thái phòng hiện tại</h3>
        <p className="text-gray-400 text-xs mb-4">Phân bổ tình trạng phòng</p>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={statusData} cx="50%" cy="50%" outerRadius={90} dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}>
              {statusData.map((entry, i) => (
                <Cell key={i} fill={STATUS_COLORS[entry.name] ?? "#94a3b8"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}