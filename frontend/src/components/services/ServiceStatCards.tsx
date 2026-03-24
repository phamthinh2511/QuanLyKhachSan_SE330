import { Service } from "@/types/service";

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
    { label: "Tổng dịch vụ",    value: String(totalServices), sub: null },
    { label: "Danh mục",         value: String(categories),    sub: null },
    { label: "Giá trung bình",   value: `${avgPrice}đ`,        sub: null },
    { label: "Phổ biến nhất",    value: popular?.name ?? "-",  sub: null },
  ];

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div key={c.label} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm text-center">
          <p className="text-gray-400 text-sm mb-2">{c.label}</p>
          <p className="text-2xl font-bold text-gray-800">{c.value}</p>
        </div>
      ))}
    </div>
  );
}