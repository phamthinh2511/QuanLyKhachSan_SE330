import { ServiceUsage } from "@/types/serviceUsage";

const today = new Date().toISOString().split("T")[0];

export const mockServiceUsages: ServiceUsage[] = [
  { id: 1, usageCode: "SU-001", bookingCode: "BK-1001", customerName: "Lê Văn A",       roomNumber: "101", serviceName: "Breakfast Buffet", quantity: 2, unitPrice: 25, total: 50,  date: today,        status: "Paid"    },
  { id: 2, usageCode: "SU-002", bookingCode: "BK-1001", customerName: "Lê Văn A",       roomNumber: "101", serviceName: "Laundry Service",  quantity: 1, unitPrice: 20, total: 20,  date: today,        status: "Pending" },
  { id: 3, usageCode: "SU-003", bookingCode: "BK-1002", customerName: "Nguyễn Thanh B", roomNumber: "202", serviceName: "Spa Treatment",    quantity: 1, unitPrice: 80, total: 80,  date: today,        status: "Paid"    },
  { id: 4, usageCode: "SU-004", bookingCode: "BK-1004", customerName: "Bành Thị D",     roomNumber: "401", serviceName: "Airport Pickup",   quantity: 1, unitPrice: 50, total: 50,  date: today,        status: "Paid"    },
  { id: 5, usageCode: "SU-005", bookingCode: "BK-1004", customerName: "Bành Thị D",     roomNumber: "401", serviceName: "Room Service",     quantity: 3, unitPrice: 15, total: 45,  date: today,        status: "Pending" },
  { id: 6, usageCode: "SU-006", bookingCode: "BK-1003", customerName: "Trần Thị C",     roomNumber: "301", serviceName: "Breakfast Buffet", quantity: 1, unitPrice: 25, total: 25,  date: "2026-03-10", status: "Paid"    },
  { id: 7, usageCode: "SU-007", bookingCode: "BK-1005", customerName: "Nguyễn Văn E",   roomNumber: "102", serviceName: "Laundry Service",  quantity: 2, unitPrice: 20, total: 40,  date: "2026-03-12", status: "Paid"    },
  { id: 8, usageCode: "SU-008", bookingCode: "BK-1003", customerName: "Trần Thị C",     roomNumber: "301", serviceName: "Spa Treatment",    quantity: 1, unitPrice: 80, total: 80,  date: "2026-03-14", status: "Pending" },
];