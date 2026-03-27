import { ServiceUsage } from "@/types/serviceUsage";

interface Props { usages: ServiceUsage[] }

export default function ServiceUsageStatCards({ usages }: Props) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthLabel = `Tháng ${now.getMonth() + 1}/${currentYear}`;

  const thisMonth = usages.filter((u) => {
    const d = new Date(u.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const totalUsages  = thisMonth.length;
  const totalRevenue = thisMonth.filter((u) => u.status === "Paid").reduce((sum, u) => sum + u.total, 0);
  const pending      = thisMonth.filter((u) => u.status === "Pending").reduce((sum, u) => sum + u.total, 0);
  const todayCount   = usages.filter((u) => u.date === now.toISOString().split("T")[0]).length;

  const cards = [
    { label: `Tổng lượt dùng (${monthLabel})`, value: String(totalUsages),              color: "text-gray-800"   },
    { label: `Doanh thu (${monthLabel})`,       value: `$${totalRevenue.toLocaleString()}`, color: "text-green-600"  },
    { label: `Chờ thanh toán (${monthLabel})`,  value: `$${pending.toLocaleString()}`,   color: "text-orange-500" },
    { label: "Lượt dùng hôm nay",               value: String(todayCount),               color: "text-blue-600"   },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <p className="text-gray-400 text-sm mb-2">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}