import { DollarSign, Percent, Users } from "lucide-react";

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
    { 
      label: "Tổng doanh thu", 
      value: `${stats.revenue.toLocaleString()} VNĐ`,  
      iconBg: "bg-blue-50 border border-blue-100",   
      iconColor: "text-blue-600",   
      icon: <DollarSign className="w-5 h-5 text-blue-600" /> 
    },
    { 
      label: "Tỷ lệ lấp đầy",  
      value: `${stats.occupancy.toFixed(2)}%`,                
      iconBg: "bg-purple-50 border border-purple-100", 
      iconColor: "text-purple-600", 
      icon: <Percent className="w-5 h-5 text-purple-600" /> 
    },
    { 
      label: "Tổng khách",     
      value: stats.guests.toLocaleString(),         
      iconBg: "bg-amber-50 border border-amber-100", 
      iconColor: "text-amber-600", 
      icon: <Users className="w-5 h-5 text-amber-600" /> 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex items-start justify-between hover:-translate-y-1.5 hover:translate-x-1.5 hover:shadow-md transition-all duration-300 cursor-pointer">
          <div>
            <p className="text-gray-400 text-sm mb-1 font-medium">{c.label}</p>
            <p className="text-2xl font-bold text-gray-800">{c.value}</p>
          </div>
          <div className={`p-3 rounded-xl ${c.iconBg} ${c.iconColor}`}>
            {c.icon}
          </div>
        </div>
      ))}
    </div>
  );
}