export type BookingStatus =
  | "Checked-in"
  | "Checked-out"
  | "Đã đặt"
  | "Đã hủy"
  | "Chưa nhận"
  | "Đã nhận phòng tại quầy"
  | "Đã nhận phòng đặt trước"
  | "Đã nhận phòng"
  | "Đang sử dụng"
  | "Đã trả phòng"
  | "Đặt trước";

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