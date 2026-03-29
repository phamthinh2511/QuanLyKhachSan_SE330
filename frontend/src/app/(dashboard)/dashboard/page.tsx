"use client";
import { BedDouble, CheckCircle, XCircle, CalendarCheck, CalendarX, DollarSign } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RoomStatusChart from "@/components/dashboard/RoomStatusChart";

const stats = [
  { title: "Phòng khả dụng", value: "150", change: "+0%", isPositive: true, icon: <BedDouble className="w-6 h-6 text-blue-600" />, iconBg: "bg-blue-100" },
  { title: "Có thể đặt", value: "45", change: "-12%", isPositive: false, icon: <CheckCircle className="w-6 h-6 text-green-600" />, iconBg: "bg-green-100" },
  { title: "Đang ở", value: "105", change: "+12%", isPositive: true, icon: <XCircle className="w-6 h-6 text-orange-500" />, iconBg: "bg-orange-100" },
  { title: "Check-ins hôm nay", value: "23", change: "+5%", isPositive: true, icon: <CalendarCheck className="w-6 h-6 text-purple-600" />, iconBg: "bg-purple-100" },
  { title: "Check-outs hôm nay", value: "18", change: "+3%", isPositive: true, icon: <CalendarX className="w-6 h-6 text-pink-600" />, iconBg: "bg-pink-100" },
  { title: "Doanh thu tháng", value: "15,420", change: "+18%", isPositive: true, icon: <DollarSign className="w-6 h-6 text-emerald-600" />, iconBg: "bg-emerald-100" },
];

const SayHi = () => {console.log("Hi from the dashboard!");}
  


export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="p-6 rounded-lg bg-white shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Trang Chủ</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button onClick={SayHi} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
          + Đặt phòng
        </button>
        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition">
          Tình trạng phòng
        </button>
        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition">
          Thêm Khách hàng
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <RoomStatusChart />
      </div>
    </div>
  );
}