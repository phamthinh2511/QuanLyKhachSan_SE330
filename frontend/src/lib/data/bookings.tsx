import { Booking } from "@/types/booking";

const today = new Date().toISOString().split("T")[0];

export const mockBookings: Booking[] = [
  { id: 1,  bookingCode: "BK-1001", customerName: "Lê Văn A",       roomNumber: "101", checkIn: today,        checkOut: "2026-03-25", guests: 2, amount: 1050, status: "Checked-in"  },
  { id: 2,  bookingCode: "BK-1002", customerName: "Nguyễn Thanh B", roomNumber: "202", checkIn: today,        checkOut: "2026-03-24", guests: 1, amount: 240,  status: "Checked-in"  },
  { id: 3,  bookingCode: "BK-1003", customerName: "Trần Thị C",     roomNumber: "301", checkIn: today,        checkOut: "2026-03-26", guests: 3, amount: 720,  status: "Booked"      },
  { id: 4,  bookingCode: "BK-1004", customerName: "Bành Thị D",     roomNumber: "401", checkIn: today,        checkOut: "2026-03-27", guests: 2, amount: 1400, status: "Checked-in"  },
  { id: 5,  bookingCode: "BK-1005", customerName: "Nguyễn Văn E",   roomNumber: "102", checkIn: "2026-03-01", checkOut: "2026-03-04", guests: 2, amount: 360,  status: "Checked-out" },
  { id: 6,  bookingCode: "BK-1006", customerName: "Phạm Văn F",     roomNumber: "201", checkIn: "2026-03-10", checkOut: "2026-03-13", guests: 2, amount: 540,  status: "Checked-out" },
  { id: 7,  bookingCode: "BK-1007", customerName: "Hoàng Thị G",    roomNumber: "302", checkIn: "2026-03-15", checkOut: "2026-03-18", guests: 4, amount: 1050, status: "Cancelled"   },
  { id: 8,  bookingCode: "BK-1008", customerName: "Vũ Văn H",       roomNumber: "305", checkIn: "2026-03-18", checkOut: "2026-03-20", guests: 2, amount: 700,  status: "Checked-out" },
  { id: 9,  bookingCode: "BK-1009", customerName: "Đặng Thị I",     roomNumber: "201", checkIn: "2026-03-20", checkOut: "2026-03-23", guests: 3, amount: 540,  status: "Checked-out" },
  { id: 10, bookingCode: "BK-1010", customerName: "Lý Văn J",       roomNumber: "101", checkIn: "2026-04-01", checkOut: "2026-04-05", guests: 2, amount: 480,  status: "Booked"      },
];