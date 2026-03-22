export type BookingStatus = "Checked-in" | "Checked-out" | "Booked" | "Cancelled";

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