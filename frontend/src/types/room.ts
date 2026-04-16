export type RoomStatus = "Trống" | "Đang sử dụng" | "Đã đặt" | "Bảo trì";
export type RoomType = "Thường" | "Cao cấp" | "Sang trọng" | "Presidential";

export interface Room {
  id: number;
  roomNumber: string;
  type: RoomType;
  floor: number;
  capacity: number;
  pricePerNight: number;
  status: RoomStatus;
  description: string;
}