import { ServiceUsage } from "./serviceUsage";

export type InvoiceStatus  = "Đã thanh toán" | "Chờ thanh toán" | "Một phần";
export type PaymentMethod  = "Thẻ" | "Tiền mặt" | "Chuyển khoản" | "";

export interface Invoice {
  id: number;
  invoiceCode: string;
  bookingCode: string;
  customerName: string;
  roomNumber: string;
  roomCost: number;
  serviceCost: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: InvoiceStatus;
  createdAt: string; // YYYY-MM-DD
  serviceUsages?: ServiceUsage[];
}