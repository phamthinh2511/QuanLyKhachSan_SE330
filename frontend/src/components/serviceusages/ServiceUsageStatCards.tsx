import { ServiceUsage } from "@/types/serviceUsage";
import { ClipboardList, Coins, CalendarDays } from "lucide-react";

interface Props { usages: ServiceUsage[] }

export default function ServiceUsageStatCards({ usages }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthLabel = `Tháng ${now.getMonth() + 1}/${currentYear}`;

  const thisMonth = usages.filter((u) => {
    const d = new Date(u.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear && u.status !== "Đã hủy";
  });

  const totalUsages  = thisMonth.length;
  const totalRevenue = thisMonth.filter((u) => u.status === "Đã sử dụng").reduce((sum, u) => sum + u.total, 0);
  const todayCount   = usages.filter((u) => u.date === now.toISOString().split("T")[0]).length;

  const cards = [
    { 
      label: `Tổng lượt dùng (${monthLabel})`, 
      value: String(totalUsages), 
      color: "text-blue-600",
      icon: <ClipboardList className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100"
    },
    { 
      label: `Doanh thu (${monthLabel})`, 
      value: `${totalRevenue.toLocaleString()} đ`, 
      color: "text-emerald-600",
      icon: <Coins className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100"
    },
    { 
      label: "Lượt dùng hôm nay", 
      value: String(todayCount), 
      color: "text-amber-600",
      icon: <CalendarDays className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between hover:-translate-y-1.5 hover:translate-x-1.5 hover:shadow-lg transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-medium">{c.label}</p>
            <p className={`text-2xl font-bold tracking-tight ${c.color}`}>{c.value}</p>
          </div>
          <div className={`p-3 rounded-xl ${c.iconBg}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}