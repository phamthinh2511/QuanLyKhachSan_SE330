import { Invoice } from "@/types/invoice";
import { Receipt, CheckCircle2, Clock, Calendar } from "lucide-react";

interface Props {
  totalCount: number;
  paidAmount: number;
  pendingAmount: number;
  monthLabel: string;
}

export default function InvoiceStatCards({ totalCount, paidAmount, pendingAmount, monthLabel }: Props) {
  const cards = [
    { 
      label: "Tổng hóa đơn", 
      value: String(totalCount), 
      color: "text-blue-600",
      icon: <Receipt className="w-5 h-5 text-blue-600" />,
      iconBg: "bg-blue-50 border border-blue-100"
    },
    { 
      label: "Đã thanh toán", 
      value: `${paidAmount.toLocaleString()} đ`, 
      color: "text-emerald-600",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      iconBg: "bg-emerald-50 border border-emerald-100"
    },
    { 
      label: "Chờ thanh toán", 
      value: `${pendingAmount.toLocaleString()} đ`, 
      color: "text-amber-600",
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      iconBg: "bg-amber-50 border border-amber-100"
    },
    { 
      label: "Khoảng thời gian", 
      value: monthLabel, 
      color: "text-purple-600",
      icon: <Calendar className="w-5 h-5 text-purple-600" />,
      iconBg: "bg-purple-50 border border-purple-100"
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
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