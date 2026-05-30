import { Service } from "@/types/service";
import { text } from "stream/consumers";

interface Props { services: Service[] }



export default function ServiceStatCards({ services }: Props) {
  const totalServices = services.length;
  const avgPrice = totalServices > 0
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / totalServices)
    : 0;

  const cards = [
    { label: "Tổng dịch vụ",    value: String(totalServices), sub: null , color: "text-slate-800"},
    { label: "Giá trung bình",   value: `${avgPrice.toLocaleString("vi-VN")} VNĐ`,        sub: null , color: "text-green-800"},
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <p className="text-gray-400 text-sm mb-2">{c.label}</p>
          <p className={`text-2xl font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
    </div>
  );
}