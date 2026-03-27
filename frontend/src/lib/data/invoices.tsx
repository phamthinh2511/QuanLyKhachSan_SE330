import { Invoice } from "@/types/invoice";

const now = new Date();
const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

export const mockInvoices: Invoice[] = [
  { id: 1, invoiceCode: "INV-2026-001", bookingCode: "BK-1001", customerName: "Lê Văn A",       roomNumber: "101", roomCost: 1050, serviceCost: 70,  total: 1120, paymentMethod: "Credit Card",  status: "Paid",    createdAt: `${thisMonth}-05` },
  { id: 2, invoiceCode: "INV-2026-002", bookingCode: "BK-1002", customerName: "Nguyễn Thanh B", roomNumber: "202", roomCost: 240,  serviceCost: 80,  total: 320,  paymentMethod: "Cash",         status: "Paid",    createdAt: `${thisMonth}-05` },
  { id: 3, invoiceCode: "INV-2026-003", bookingCode: "BK-1003", customerName: "Trần Thị C",     roomNumber: "301", roomCost: 720,  serviceCost: 0,   total: 720,  paymentMethod: "",             status: "Pending", createdAt: `${thisMonth}-06` },
  { id: 4, invoiceCode: "INV-2026-004", bookingCode: "BK-1004", customerName: "Bành Thị D",     roomNumber: "401", roomCost: 1400, serviceCost: 95,  total: 1495, paymentMethod: "Bank Transfer", status: "Partial", createdAt: `${thisMonth}-06` },
];