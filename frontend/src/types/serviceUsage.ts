export type ServiceUsageStatus = "Đã sử dụng" | "Chờ sử dụng" | "Đã hủy";

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