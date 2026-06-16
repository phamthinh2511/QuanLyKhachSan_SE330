import { Service } from "@/types/service";
import { Sparkles, Coins } from "lucide-react";

interface Props { services: Service[] }

export default function ServiceStatCards({ services }: Props) {
  const totalServices = services.length;
  const avgPrice = totalServices > 0
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / totalServices)
    : 0;

  const cards = [
    { 
      label: "Tổng dịch vụ",    
      value: String(totalServices), 
      color: "text-blue-600",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100"
    },
    { 
      label: "Giá trung bình",   
      value: `${avgPrice.toLocaleString("vi-VN")} VNĐ`,        
      color: "text-emerald-600",
      icon: <Coins className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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