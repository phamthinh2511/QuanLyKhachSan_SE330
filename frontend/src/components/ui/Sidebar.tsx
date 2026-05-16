"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Thêm useRouter
import {
  LayoutDashboard, Users, BedDouble, CalendarCheck,
  Wrench, FileText, Receipt, UserCog, BarChart3,
  Settings, Hotel, LogOut, ShieldCheck, Layers
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Trang Chủ", icon: LayoutDashboard },
  { href: "/customers", label: "Khách Hàng", icon: Users },
  { href: "/rooms", label: "Phòng", icon: BedDouble },
  { href: "/room-types", label: "Loại Phòng", icon: Layers },
  { href: "/bookings", label: "Đặt Phòng", icon: CalendarCheck },
  { href: "/services", label: "Dịch Vụ", icon: Wrench },
  { href: "/serviceusage", label: "Yêu Cầu Dịch Vụ", icon: FileText },
  { href: "/invoices", label: "Hóa Đơn", icon: Receipt },
  { href: "/employees", label: "Nhân Viên", icon: UserCog },
  { href: "/reports", label: "Báo Cáo", icon: BarChart3 },
];

export default function Sidebar() {
  // Khai báo Hook ở ngay dòng đầu tiên của Component
  const pathname = usePathname();
  const router = useRouter();

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // 1. Xóa token khỏi bộ nhớ trình duyệt
    localStorage.removeItem("token");
    
    // 2. Chuyển hướng về trang đăng nhập
    router.push("/login");
  };

  return (
    <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col">
      {/* Brand */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <Hotel className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-800 text-base">Hotel Manager</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              pathname === href
                ? "bg-blue-50 text-blue-600"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Settings & Logout */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3 space-y-1">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
        >
          <Settings className="w-4 h-4" />
          Cài đặt
        </Link>
        
        {/* NÚT ĐĂNG XUẤT */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition w-full text-left"
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}