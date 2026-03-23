import { Room } from "@/types/room";

export const mockRooms: Room[] = [
  { id: 1, roomNumber: "101", type: "Thường",     floor: 1, capacity: 2, pricePerNight: 120, status: "Trống",          description: "Phòng tiêu chuẩn thoải mái với view thành phố" },
  { id: 2, roomNumber: "102", type: "Thường",     floor: 1, capacity: 2, pricePerNight: 120, status: "Đang sử dụng",   description: "Phòng tiêu chuẩn thoải mái với view thành phố" },
  { id: 3, roomNumber: "201", type: "Cao cấp",       floor: 2, capacity: 3, pricePerNight: 180, status: "Trống",          description: "Phòng deluxe rộng rãi có ban công" },
  { id: 4, roomNumber: "202", type: "Cao cấp",       floor: 2, capacity: 3, pricePerNight: 180, status: "Đã đặt",         description: "Phòng deluxe rộng rãi có ban công" },
  { id: 5, roomNumber: "301", type: "Sang trọng",        floor: 3, capacity: 4, pricePerNight: 350, status: "Trống",          description: "Suite cao cấp với phòng khách riêng biệt" },
  { id: 6, roomNumber: "302", type: "Sang trọng",        floor: 3, capacity: 4, pricePerNight: 350, status: "Đang sử dụng",   description: "Suite cao cấp với phòng khách riêng biệt" },
  { id: 7, roomNumber: "305", type: "Sang trọng",        floor: 3, capacity: 4, pricePerNight: 350, status: "Bảo trì",        description: "Suite cao cấp với phòng khách riêng biệt" },
  { id: 8, roomNumber: "401", type: "Siêu cấp vip pro", floor: 4, capacity: 6, pricePerNight: 650, status: "Trống",          description: "Suite tổng thống với tầm nhìn toàn cảnh" },
];