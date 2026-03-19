import { BedDouble, CheckCircle, XCircle, CalendarCheck, CalendarX, DollarSign } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RoomStatusChart from "@/components/dashboard/RoomStatusChart";

const stats = [
  { title: "Total Rooms", value: "150", change: "+0%", isPositive: true, icon: <BedDouble className="w-6 h-6 text-blue-600" />, iconBg: "bg-blue-100" },
  { title: "Available Rooms", value: "45", change: "-12%", isPositive: false, icon: <CheckCircle className="w-6 h-6 text-green-600" />, iconBg: "bg-green-100" },
  { title: "Occupied Rooms", value: "105", change: "+12%", isPositive: true, icon: <XCircle className="w-6 h-6 text-orange-500" />, iconBg: "bg-orange-100" },
  { title: "Today's Check-ins", value: "23", change: "+5%", isPositive: true, icon: <CalendarCheck className="w-6 h-6 text-purple-600" />, iconBg: "bg-purple-100" },
  { title: "Today's Check-outs", value: "18", change: "+3%", isPositive: true, icon: <CalendarX className="w-6 h-6 text-pink-600" />, iconBg: "bg-pink-100" },
  { title: "Total Revenue Today", value: "$15,420", change: "+18%", isPositive: true, icon: <DollarSign className="w-6 h-6 text-emerald-600" />, iconBg: "bg-emerald-100" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm">Welcome back, Admin</p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 transition">
          + New Booking
        </button>
        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition">
          Check Room Status
        </button>
        <button className="border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium px-4 py-2.5 rounded-xl transition">
          Add Customer
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