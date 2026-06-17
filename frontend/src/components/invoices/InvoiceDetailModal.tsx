"use client";

import { useRef, useState } from "react";
import { X, Download, FileText } from "lucide-react";
import { Invoice } from "@/types/invoice";

interface Props {
  invoice: Invoice;
  onClose: () => void;
}

export default function InvoiceDetailModal({ invoice, onClose }: Props) {
  const [isExporting, setIsExporting] = useState(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const handleExportExcel = () => {
    let csv = "\uFEFF"; // UTF-8 BOM
    csv += "CHI TIẾT HÓA ĐƠN\n";
    csv += `Mã hóa đơn,${invoice.invoiceCode || ""}\n`;
    csv += `Khách hàng,"${(invoice.customerName || "").replace(/"/g, '""')}"\n`;
    csv += `Mã booking,${invoice.bookingCode || ""}\n`;
    csv += `Phòng,${invoice.roomNumber || ""}\n`;
    csv += `Nhân viên,"${String(invoice.tenNhanVien ? `${invoice.tenNhanVien} (ID: ${invoice.maNhanVien})` : invoice.maNhanVien || "—").replace(/"/g, '""')}"\n`;
    csv += `Ngày tạo,${invoice.createdAt || ""}\n`;
    csv += `Thanh toán,"${(invoice.paymentMethod || "—").replace(/"/g, '""')}"\n`;
    csv += `Trạng thái,"${(invoice.status || "").replace(/"/g, '""')}"\n\n`;

    csv += "Khoản mục,Chi tiết dịch vụ,Số tiền (VND)\n";
    csv += `Tiền phòng,Tiền phòng ${invoice.roomNumber || ""},${invoice.roomCost || 0}\n`;

    if (invoice.serviceUsages && invoice.serviceUsages.length > 0) {
      invoice.serviceUsages.forEach((usage) => {
        const serviceName = (usage.serviceName || "").replace(/"/g, '""');
        csv += `Dịch vụ,"${serviceName} (SL: ${usage.quantity}) - Ngày: ${usage.date}",${usage.total || 0}\n`;
      });
    } else {
      csv += `Dịch vụ,Dịch vụ sử dụng,${invoice.serviceCost || 0}\n`;
    }

    csv += `Tổng cộng,,${invoice.total || 0}\n`;

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `HoaDon_${invoice.invoiceCode || "Export"}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = async () => {
    try {
      setIsExporting(true);
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas-pro");
      if (!invoiceRef.current) return;

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [imgWidth, imgHeight],
      });
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`HoaDon_${invoice.invoiceCode || "Export"}.pdf`);
    } catch (error) {
      console.error("Lỗi khi xuất PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-semibold text-gray-800">Chi tiết hóa đơn</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={isExporting}
              className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-400 text-white text-sm px-3 py-2 rounded-lg transition"
            >
              <FileText className="w-4 h-4" />
              {isExporting ? "Đang xuất..." : "Xuất PDF"}
            </button>
            <button onClick={handleExportExcel}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-3 py-2 rounded-lg transition">
              <Download className="w-4 h-4" />
              Xuất Excel
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Nội dung hóa đơn */}
        <div ref={invoiceRef} className="p-8 bg-white">
          {/* Hotel Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-blue-600">Nhóm 1</h1>
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
              <p className="text-gray-500">Nhân viên lập: <span className="font-semibold text-gray-800">{invoice.tenNhanVien ? `${invoice.tenNhanVien} (ID: ${invoice.maNhanVien})` : invoice.maNhanVien || "—"}</span></p>
            </div>
            <div className="space-y-1.5 text-right">
              <p className="text-gray-500">Ngày tạo: <span className="font-semibold text-gray-800">{invoice.createdAt}</span></p>
              <p className="text-gray-500">Thanh toán: <span className="font-semibold text-gray-800">{invoice.paymentMethod || "—"}</span></p>
              <p className="text-gray-500">Trạng thái:&nbsp;
                <span className={`font-semibold ${
                  invoice.status === "Đã thanh toán" ? "text-green-600" : "text-orange-600"
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
                <td className="px-4 py-3 text-right text-gray-700 border border-gray-200">{invoice.roomCost.toLocaleString()}</td>
              </tr>
              {invoice.serviceUsages && invoice.serviceUsages.length > 0 ? (
                invoice.serviceUsages.map((usage) => (
                  <tr key={usage.id}>
                    <td className="px-4 py-3 text-gray-700 border border-gray-200">
                      Dịch vụ: {usage.serviceName} (SL: {usage.quantity}) - Ngày: {usage.date}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700 border border-gray-200">
                      {usage.total.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 text-gray-700 border border-gray-200">Dịch vụ sử dụng</td>
                  <td className="px-4 py-3 text-right text-gray-700 border border-gray-200">{invoice.serviceCost.toLocaleString()}</td>
                </tr>
              )}
              <tr className="bg-blue-50">
                <td className="px-4 py-3 font-bold text-gray-800 border border-gray-200">Tổng cộng</td>
                <td className="px-4 py-3 text-right font-bold text-blue-600 text-lg border border-gray-200">{invoice.total.toLocaleString()}</td>
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