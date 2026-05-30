import { Invoice } from "@/types/invoice";

interface Props { invoices: Invoice[] }

export default function InvoiceStatCards({ invoices }: Props) {
  const now = new Date();
  const monthLabel = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;

  const thisMonth = invoices.filter((inv) => {
    const d = new Date(inv.createdAt);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const total   = thisMonth.length;
  const paid    = thisMonth.filter((i) => i.status === "Đã thanh toán").reduce((s, i) => s + i.total, 0);
  const pending = thisMonth.filter((i) => i.status !== "Đã thanh toán").reduce((s, i) => s + i.total, 0);

  const cards = [
    { label: `Tổng hóa đơn (${monthLabel})`, value: String(total),              color: "text-gray-800"   },
    { label: `Đã thanh toán (${monthLabel})`, value: `${paid.toLocaleString()}`,    color: "text-green-600"  },
    { label: `Chờ thanh toán (${monthLabel})`,value: `${pending.toLocaleString()}`, color: "text-orange-500" },
    { label: `Tháng này`,                     value: String(total),              color: "text-blue-600"   },
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