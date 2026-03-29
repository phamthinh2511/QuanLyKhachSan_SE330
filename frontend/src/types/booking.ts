export type BookingStatus = "Checked-in" | "Checked-out" | "Đã đặt" | "Đã hủy";

export interface Booking {
  id: number;
  bookingCode: string;
  customerName: string;
  roomNumber: string;
  checkIn: string;   // YYYY-MM-DD
  checkOut: string;  // YYYY-MM-DD
  guests: number;
  amount: number;
  status: BookingStatus;
}