import { Invoice } from "@/types/invoice";

interface Props {
  totalCount: number;
  paidAmount: number;
  pendingAmount: number;
  monthLabel: string;
}

export default function InvoiceStatCards({ totalCount, paidAmount, pendingAmount, monthLabel }: Props) {
  const cards = [
    { label: `Tổng hóa đơn`, value: String(totalCount), color: "text-gray-800" },
    { label: `Đã thanh toán`, value: `${paidAmount.toLocaleString()} đ`, color: "text-green-600" },
    { label: `Chờ thanh toán`, value: `${pendingAmount.toLocaleString()} đ`, color: "text-orange-500" },
    { label: `Khoảng thời gian`, value: monthLabel, color: "text-blue-600" },
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