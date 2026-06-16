"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, CheckCircle, XCircle, CalendarCheck, CalendarX, DollarSign } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RoomStatusChart from "@/components/dashboard/RoomStatusChart";

import { getRooms } from "@/lib/api/rooms";
import { getAllBookings } from "@/lib/api/bookings";
import { getReportData, ReportData } from "@/lib/api/invoices";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";
import { getUser } from "@/lib/auth";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [yearReport, setYearReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);

  useEffect(() => {
    setUser(getUser());

    async function loadDashboardData() {
      try {
        setLoading(true);
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const [roomsData, bookingsRes, reportYearData, reportMonthData] = await Promise.all([
          getRooms().catch(() => []),
          getAllBookings().catch(() => ({ code: 200, result: [] })),
          getReportData({ type: "year", year: currentYear }).catch(() => null),
          getReportData({ type: "month", year: currentYear, value: currentMonth }).catch(() => null),
        ]);

        setRooms(roomsData);
        setBookings(bookingsRes.result || []);
        setYearReport(reportYearData);
        setMonthlyRevenue(reportMonthData?.revenue || 0);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Compute metrics
  const activeRoomsCount = rooms.filter(r => r.status !== "Bảo trì").length;
  const vacantRoomsCount = rooms.filter(r => r.status === "Trống").length;
  const occupiedRoomsCount = rooms.filter(r => r.status === "Đang sử dụng").length;

  const todayStr = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const checkinsTodayCount = bookings.filter(b => b.checkIn === todayStr && b.status !== "Đã hủy").length;
  const checkoutsTodayCount = bookings.filter(b => b.checkOut === todayStr && b.status !== "Đã hủy").length;

  const stats = [
    { title: "Phòng khả dụng", value: String(activeRoomsCount), icon: <BedDouble className="w-6 h-6 text-blue-600" />, iconBg: "bg-blue-100" },
    { title: "Có thể đặt", value: String(vacantRoomsCount), icon: <CheckCircle className="w-6 h-6 text-green-600" />, iconBg: "bg-green-100" },
    { title: "Đang ở", value: String(occupiedRoomsCount), icon: <XCircle className="w-6 h-6 text-orange-500" />, iconBg: "bg-orange-100" },
    { title: "Check-ins hôm nay", value: String(checkinsTodayCount), icon: <CalendarCheck className="w-6 h-6 text-purple-600" />, iconBg: "bg-purple-100" },
    { title: "Check-outs hôm nay", value: String(checkoutsTodayCount), icon: <CalendarX className="w-6 h-6 text-pink-600" />, iconBg: "bg-pink-100" },
    { title: "Doanh thu tháng", value: monthlyRevenue.toLocaleString("vi-VN") + " đ", icon: <DollarSign className="w-6 h-6 text-emerald-600" />, iconBg: "bg-emerald-100" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
          <p className="text-gray-400 text-sm font-medium">Đang tải dữ liệu trang chủ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Trang Chủ</h1>
        <p className="text-gray-500 text-sm mt-0.5">Welcome back, {user?.name || "Admin"}</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => router.push("/bookings?add=true")}
          className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition cursor-pointer"
        >
          + Đặt phòng
        </button>
        <button
          onClick={() => router.push("/rooms")}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Tình trạng phòng
        </button>
        <button
          onClick={() => router.push("/customers?add=true")}
          className="bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition cursor-pointer"
        >
          Thêm Khách hàng
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart reportData={yearReport} />
        <RoomStatusChart rooms={rooms} />
      </div>
    </div>
  );
}