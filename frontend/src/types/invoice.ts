export type InvoiceStatus  = "Paid" | "Pending" | "Partial";
export type PaymentMethod  = "Credit Card" | "Cash" | "Bank Transfer" | "";

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
}