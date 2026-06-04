interface Props {
  stats: {
    revenue: number;
    profit: number;
    occupancy: number;
    guests: number;
  };
}

export default function ReportStatCards({ stats }: Props) {
  const cards = [
    { label: "Tổng doanh thu", value: `${stats.revenue.toLocaleString()} VNĐ`,  iconBg: "bg-blue-100",   iconColor: "text-blue-600",   icon: "₫" },
    { label: "Tỷ lệ lấp đầy",  value: `${stats.occupancy.toFixed(2)}%`,                iconBg: "bg-purple-100", iconColor: "text-purple-600", icon: "⊟" },
    { label: "Tổng khách",     value: stats.guests.toLocaleString(),         iconBg: "bg-orange-100", iconColor: "text-orange-500", icon: "👤" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between">
          <div>
            <p className="text-gray-400 text-sm mb-1">{c.label}</p>
            <p className="text-2xl font-bold text-gray-800 mb-2">{c.value}</p>
          </div>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${c.iconBg} ${c.iconColor}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}