"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";
import { getRooms } from "@/lib/api/rooms";
import { getAllBookings } from "@/lib/api/bookings";

export default function RoomPerformance() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRooms(), getAllBookings()])
      .then(([roomsData, bookingsData]) => {
        setRooms(roomsData || []);
        const rawList = Array.isArray(bookingsData) ? bookingsData : [];
        const mappedBookings = rawList.map((b: any) => ({
          id: b.id,
          bookingCode: String(b.id),
          customerName: b.customerName || "Khách vãng lai",
          roomNumber: b.roomNumber || "Chưa gán",
          checkIn: b.checkIn ? String(b.checkIn) : "",
          checkOut: b.checkOut ? String(b.checkOut) : "",
          bookingDate: b.bookingDate || "",
          status: b.status || "Chưa nhận",
          amount: b.thanhTien || b.tongTien || b.tongGia || b.amount || 0,
          guests: b.guests || b.soKhach || 1
        }));
        setBookings(mappedBookings);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 text-sm">Đang tải dữ liệu báo cáo...</div>
      </div>
    );
  }

  // Bookings theo loại phòng
  const typeMap: Record<string, number> = {};
  bookings.forEach((b) => {
    const room = rooms.find((r) => r.roomNumber === b.roomNumber);
    if (!room) return;
    typeMap[room.type] = (typeMap[room.type] ?? 0) + 1;
  });
  const typeData = Object.entries(typeMap).map(([type, bookings]) => ({ type, bookings }));

  // Trạng thái phòng
  const statusMap: Record<string, number> = {};
  rooms.forEach((r) => { statusMap[r.status] = (statusMap[r.status] ?? 0) + 1; });
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