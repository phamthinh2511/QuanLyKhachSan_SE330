import { ServiceUsage } from "@/types/serviceUsage";

const today = new Date().toISOString().split("T")[0];

export const mockServiceUsages: ServiceUsage[] = [
  { id: 1, usageCode: "USG-001", bookingCode: "BK001", customerName: "Nguyễn Văn A", roomNumber: "101", serviceName: "Buffet sáng", quantity: 150, unitPrice: 100000, total: 15000000, date: today, status: "Đã sử dụng" },
  { id: 2, usageCode: "USG-002", bookingCode: "BK002", customerName: "Trần Thị B", roomNumber: "102", serviceName: "Giặt ủi", quantity: 85, unitPrice: 50000, total: 4250000, date: today, status: "Đã sử dụng" },
  { id: 3, usageCode: "USG-003", bookingCode: "BK003", customerName: "Lê Văn C", roomNumber: "201", serviceName: "Spa trị liệu", quantity: 42, unitPrice: 400000, total: 16800000, date: today, status: "Đã sử dụng" },
  { id: 4, usageCode: "USG-004", bookingCode: "BK001", customerName: "Nguyễn Văn A", roomNumber: "101", serviceName: "Dịch vụ phòng", quantity: 95, unitPrice: 100000, total: 9500000, date: today, status: "Đã sử dụng" },
  { id: 5, usageCode: "USG-005", bookingCode: "BK004", customerName: "Phạm Minh D", roomNumber: "202", serviceName: "Đưa đón sân bay", quantity: 30, unitPrice: 400000, total: 12000000, date: today, status: "Đã sử dụng" },
  { id: 6, usageCode: "USG-006", bookingCode: "BK002", customerName: "Trần Thị B", roomNumber: "102", serviceName: "Thuê xe máy", quantity: 60, unitPrice: 150000, total: 9000000, date: today, status: "Đã sử dụng" },
];