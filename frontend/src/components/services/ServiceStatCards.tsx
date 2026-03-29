import { Service } from "@/types/service";
import { text } from "stream/consumers";

interface Props { services: Service[] }



export default function ServiceStatCards({ services }: Props) {
  const totalServices = services.length;
  const categories = new Set(services.map((s) => s.category)).size;
  const avgPrice = totalServices > 0
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / totalServices)
    : 0;
  const popular = services.reduce(
    (max, s) => (s.price > max.price ? s : max),
    services[0] ?? { name: "-", price: 0 }
  );

  const cards = [
    { label: "Tổng dịch vụ",    value: String(totalServices), sub: null , color: "text-black-800"},
    { label: "Danh mục",         value: String(categories),    sub: null , color: "text-green-600"},
    { label: "Giá trung bình",   value: `${avgPrice}đ`,        sub: null , color: "text-green-800"},
    { label: "Phổ biến nhất",    value: popular?.name ?? "-",  sub: null , color: "text-violet-800"},
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