"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";
import { getRooms } from "@/lib/api/rooms";
import { getAllBookings } from "@/lib/api/bookings";

const fallbackRooms: Room[] = [
  { id: 1, roomNumber: "101", type: "Standard", status: "Trống", pricePerNight: 500000, floor: 1, capacity: 2, description: "Phòng Standard hướng phố" },
  { id: 2, roomNumber: "102", type: "Standard", status: "Đang sử dụng", pricePerNight: 500000, floor: 1, capacity: 2, description: "Phòng Standard hướng phố" },
  { id: 3, roomNumber: "201", type: "Deluxe", status: "Đang sử dụng", pricePerNight: 800000, floor: 2, capacity: 2, description: "Phòng Deluxe hướng hồ" },
  { id: 4, roomNumber: "202", type: "Deluxe", status: "Đã đặt", pricePerNight: 800000, floor: 2, capacity: 2, description: "Phòng Deluxe hướng hồ" },
  { id: 5, roomNumber: "301", type: "Suite", status: "Bảo trì", pricePerNight: 1500000, floor: 3, capacity: 2, description: "Phòng Suite cao cấp" },
  { id: 6, roomNumber: "302", type: "Suite", status: "Trống", pricePerNight: 1500000, floor: 3, capacity: 2, description: "Phòng Suite cao cấp" },
  { id: 7, roomNumber: "401", type: "Standard", status: "Trống", pricePerNight: 500000, floor: 4, capacity: 2, description: "Phòng Standard hướng phố" },
  { id: 8, roomNumber: "402", type: "Deluxe", status: "Đang sử dụng", pricePerNight: 800000, floor: 4, capacity: 2, description: "Phòng Deluxe hướng hồ" },
];

const fallbackBookings: Booking[] = [
  { id: 1, bookingCode: "1", customerName: "Nguyễn Văn A", roomNumber: "101", checkIn: "2026-06-01", checkOut: "2026-06-03", status: "Đã trả phòng", amount: 1000000, guests: 2 },
  { id: 2, bookingCode: "2", customerName: "Trần Thị B", roomNumber: "102", checkIn: "2026-06-02", checkOut: "2026-06-05", status: "Đang sử dụng", amount: 1500000, guests: 2 },
  { id: 3, bookingCode: "3", customerName: "Lê Văn C", roomNumber: "201", checkIn: "2026-06-02", checkOut: "2026-06-04", status: "Đang sử dụng", amount: 1600000, guests: 1 },
  { id: 4, bookingCode: "4", customerName: "Phạm Minh D", roomNumber: "202", checkIn: "2026-06-03", checkOut: "2026-06-06", status: "Chưa nhận", amount: 2400000, guests: 3 },
  { id: 5, bookingCode: "5", customerName: "Hoàng Văn E", roomNumber: "302", checkIn: "2026-06-01", checkOut: "2026-06-02", status: "Đã trả phòng", amount: 1500000, guests: 2 },
  { id: 6, bookingCode: "6", customerName: "Ngô Thị F", roomNumber: "402", checkIn: "2026-06-02", checkOut: "2026-06-05", status: "Đang sử dụng", amount: 2400000, guests: 2 },
];

export default function RoomPerformance() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRooms(), getAllBookings()])
      .then(([roomsData, bookingsData]) => {
        const finalRooms = roomsData && roomsData.length > 0 ? roomsData : fallbackRooms;
        setRooms(finalRooms);

        const rawList = Array.isArray(bookingsData) ? bookingsData : [];
        if (rawList.length > 0) {
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
        } else {
          setBookings(fallbackBookings);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setRooms(fallbackRooms);
        setBookings(fallbackBookings);
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