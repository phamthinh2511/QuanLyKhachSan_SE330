export type RoomStatus = "Trống" | "Đang sử dụng" | "Đã đặt" | "Bảo trì";

export interface Room {
  id: number;
  roomNumber: string;
  loaiPhongId?: number; // Thêm trường id loại phòng
  type: string;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  description: string;
}