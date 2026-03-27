"use client";

import { useRef } from "react";
import { X, Printer } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceDetailModal({ invoice, onClose }: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handleExportPDF = async () => {
    const { default: jsPDF } = await import("jspdf");
    const { default: html2canvas } = await import("html2canvas");

    if (!printRef.current) return;

    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const pdfWidth  = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${invoice.invoiceCode}.pdf`);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">Chi tiết hóa đơn</h2>
          <div className="flex items-center gap-2">
            <button onClick={handleExportPDF}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-lg transition">
              <Printer className="w-4 h-4" />
              Xuất PDF
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Nội dung hóa đơn — phần này sẽ được xuất PDF */}
        <div ref={printRef} className="p-8 bg-white">
          {/* Hotel Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">HOTEL MANAGER</h1>
            <p className="text-gray-500 text-sm mt-1">123 Đường ABC, TP. Hồ Chí Minh</p>
            <p className="text-gray-500 text-sm">Tel: +84 123 456 789 | Email: info@hotelmanager.com</p>
          </div>

          {/* Invoice Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-widest">Hóa Đơn Thanh Toán</h2>
            <p className="text-gray-400 text-sm mt-1">{invoice.invoiceCode}</p>
          </div>

          {/* Invoice Info */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div className="space-y-1.5">
              <p className="text-gray-500">Khách hàng: <span className="font-semibold text-gray-800">{invoice.customerName}</span></p>
              <p className="text-gray-500">Mã booking: <span className="font-semibold text-gray-800">{invoice.bookingCode}</span></p>
              <p className="text-gray-500">Phòng: <span className="font-semibold text-gray-800">{invoice.roomNumber}</span></p>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="text-gray-500">Ngày tạo: <span className="font-semibold text-gray-800">{invoice.createdAt}</span></p>
              <p className="text-gray-500">Thanh toán: <span className="font-semibold text-gray-800">{invoice.paymentMethod || "—"}</span></p>
              <p className="text-gray-500">Trạng thái:&nbsp;
                <span className={`font-semibold ${
                  invoice.status === "Paid" ? "text-green-600" :
                  invoice.status === "Partial" ? "text-yellow-600" : "text-orange-600"
                }`}>{invoice.status}</span>
              </p>
            </div>
          </div>

          {/* Chi tiết */}
          <table className="w-full text-sm mb-6 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="text-left px-4 py-3 text-gray-500 font-medium border border-gray-200">Khoản mục</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium border border-gray-200">Số tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-gray-700 border border-gray-200">Tiền phòng {invoice.roomNumber}</td>
                <td className="px-4 py-3 text-right text-gray-700 border border-gray-200">${invoice.roomCost.toLocaleString()}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-gray-700 border border-gray-200">Dịch vụ sử dụng</td>
                <td className="px-4 py-3 text-right text-gray-700 border border-gray-200">${invoice.serviceCost.toLocaleString()}</td>
              </tr>
              <tr className="bg-blue-50">
                <td className="px-4 py-3 font-bold text-gray-800 border border-gray-200">Tổng cộng</td>
                <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg border border-gray-200">${invoice.total.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>

          {/* Footer */}
          <div className="text-center text-gray-400 text-xs pt-4 border-t border-gray-100">
            <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi!</p>
            <p className="mt-1">Hóa đơn được tạo tự động bởi hệ thống Hotel Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
}