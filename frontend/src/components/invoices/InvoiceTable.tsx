import { Eye, Trash2, CreditCard, Banknote, Building2, Pencil, ShoppingCart } from "lucide-react";
import { Invoice } from "@/types/invoice";
import clsx from "clsx";

interface Props {
  invoices: Invoice[];
  onView: (inv: Invoice) => void;
  onDelete: (id: number) => void;
  onEdit?: (inv: Invoice) => void;
  onCheckout?: (invoiceData: any) => void;
}

const statusStyle: Record<string, string> = {
  "Đã thanh toán":    "bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-200 hover:text-emerald-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Chờ thanh toán": "bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-200 hover:text-amber-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
  "Một phần": "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200 hover:text-yellow-900 transition-all duration-200 cursor-default hover:scale-105 hover:shadow-xs",
};

const PaymentIcon = ({ method }: { method: string }) => {
  if (method === "Thẻ") return <><CreditCard className="w-3.5 h-3.5 text-blue-500" /> Thẻ</>;
  if (method === "Tiền mặt")        return <><Banknote   className="w-3.5 h-3.5 text-green-500" /> Tiền mặt</>;
  if (method === "Chuyển khoản") return <><Building2 className="w-3.5 h-3.5 text-purple-500" /> Chuyển khoản</>;
  return <span className="text-gray-300">—</span>;
};

export default function InvoiceTable({ invoices, onView, onDelete, onEdit, onCheckout }: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="font-semibold text-gray-800">Danh sách hóa đơn ({invoices.length})</h2>
        <p className="text-gray-400 text-xs mt-0.5">Xem và quản lý tất cả hóa đơn</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
              {["Mã HĐ", "Booking", "Khách hàng", "Phòng", "Tiền phòng", "Dịch vụ", "Tổng", "Thanh toán", "Trạng thái", "Thao tác"].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-gray-400">Không tìm thấy hóa đơn nào.</td>
              </tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-gray-50 transition">
                <td className="px-4 py-4 font-bold text-gray-700">{inv.invoiceCode}</td>
                <td className="px-4 py-4 text-gray-600">{inv.bookingCode}</td>
                <td className="px-4 py-4 text-gray-700 whitespace-nowrap">{inv.customerName}</td>
                <td className="px-4 py-4 text-gray-600">{inv.roomNumber}</td>
                <td className="px-4 py-4 text-gray-600">{inv.roomCost.toLocaleString()}</td>
                <td className="px-4 py-4 text-gray-600">{inv.serviceCost.toLocaleString()}</td>
                <td className="px-4 py-4 font-semibold text-gray-800">{inv.total.toLocaleString()}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                    <PaymentIcon method={inv.paymentMethod} />
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className={clsx("px-2.5 py-1 rounded-full text-xs font-medium border", statusStyle[inv.status])}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => onView(inv)}
                      className="p-1.5 text-blue-600 bg-blue-50 border border-blue-100 hover:bg-blue-100 rounded-lg transition flex items-center justify-center font-medium"
                      title="Xem chi tiết">
                      <Eye className="w-4 h-4" />
                    </button>
                    {onCheckout && inv.status !== "Đã thanh toán" && (
                      <button onClick={() => onCheckout(inv)}
                        className="p-1.5 text-emerald-600 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 rounded-lg transition flex items-center justify-center font-medium"
                        title="Thanh toán">
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button onClick={() => onEdit(inv)}
                        className="p-1.5 text-amber-600 bg-amber-50 border border-amber-100 hover:bg-amber-100 rounded-lg transition flex items-center justify-center font-medium"
                        title="Chỉnh sửa">
                        <Pencil className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => onDelete(inv.id)}
                      className="p-1.5 text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 rounded-lg transition flex items-center justify-center font-medium"
                      title="Xóa">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}