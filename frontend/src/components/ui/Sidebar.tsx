"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BedDouble, CalendarCheck,
  Wrench, FileText, Receipt, UserCog, BarChart3,
  Settings, Hotel,
} from "lucide-react";
import clsx from "clsx";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/rooms", label: "Rooms", icon: BedDouble },
  { href: "/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/services", label: "Services", icon: Wrench },
  { href: "/service-usage", label: "Service Usage", icon: FileText },
  { href: "/invoices", label: "Invoices", icon: Receipt },
  { href: "/employees", label: "Employees", icon: UserCog },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  const pathname = usePathname();

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

      {/* Settings */}
      <div className="px-3 pb-4 border-t border-gray-100 pt-3">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Link>
      </div>
    </aside>
  );
}