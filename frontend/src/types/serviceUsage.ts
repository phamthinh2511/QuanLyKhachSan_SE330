export type ServiceUsageStatus = "Paid" | "Pending";

export interface ServiceUsage {
  id: number;
  usageCode: string;
  bookingCode: string;
  customerName: string;
  roomNumber: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string; // YYYY-MM-DD
  status: ServiceUsageStatus;
}