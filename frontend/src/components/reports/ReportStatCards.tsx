import { TrendingUp } from "lucide-react";

interface Props {
  stats: {
    revenue: number; revenueChange: string;
    profit: number;  profitChange: string;
    occupancy: number; occupancyChange: string;
    guests: number;  guestsChange: string;
  };
}

export default function ReportStatCards({ stats }: Props) {
  const cards = [
    { label: "Tổng doanh thu", value: `$${stats.revenue.toLocaleString()}`,  change: stats.revenueChange,   iconBg: "bg-blue-100",   iconColor: "text-blue-600",   icon: "$" },
    { label: "Tổng lợi nhuận", value: `$${stats.profit.toLocaleString()}`,   change: stats.profitChange,    iconBg: "bg-green-100",  iconColor: "text-green-600",  icon: "↗" },
    { label: "Tỷ lệ lấp đầy",  value: `${stats.occupancy}%`,                change: stats.occupancyChange, iconBg: "bg-purple-100", iconColor: "text-purple-600", icon: "⊟" },
    { label: "Tổng khách",     value: stats.guests.toLocaleString(),         change: stats.guestsChange,    iconBg: "bg-orange-100", iconColor: "text-orange-500", icon: "👤" },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{c.value}</p>
            <div className="flex items-center gap-1 text-green-500 text-sm font-medium">
              <TrendingUp className="w-3.5 h-3.5" />
              {c.change}
            </div>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${c.iconBg} ${c.iconColor}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}