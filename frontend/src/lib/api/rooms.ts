import { apiClient } from "./client";
import { Room, RoomStatus } from "@/types/room";

// ── Interface khớp với PhongDTO Java ─────────────────────────────────────
export interface LoaiphongApi {
  id: number;
  tenLoaiPhong: string;
  donGia: number;
  moTa: string;
  sucChuaToiDa: number;
}

export interface PhongResponseApi {
  id: number;
  trangThai: string;
  soTang: number;
  sucChua: number;
  maLoaiPhong: LoaiphongApi; // response trả về maLoaiPhong là object
}

export interface PhongRequestApi {
  id: number;
  trangThai: string;
  soTang: number;
  sucChua: number;
  maLoaiPhong?: number; // payload gửi ID
}

// ── Map trangThai DB → RoomStatus TypeScript ─────────────────────────────
function mapStatus(trangThai: string): RoomStatus {
  const map: Record<string, RoomStatus> = {
    "Trống":          "Trống",
    "Đang sử dụng":   "Đang sử dụng",
    "Đã đặt":         "Đã đặt",
    "Bảo trì":        "Bảo trì",
  };
  return map[trangThai] ?? "Trống";
}

// ── PhongResponseApi → Room ───────────────────────────────────────────────────────
function mapToRoom(r: PhongResponseApi): Room {
  return {
    id:            r.id,
    roomNumber:    String(r.id),
    loaiPhongId:   r.maLoaiPhong?.id,
    type:          r.maLoaiPhong?.tenLoaiPhong ?? "Chưa xác định",
    floor:         r.soTang,
    capacity:      r.sucChua,
    pricePerNight: r.maLoaiPhong?.donGia ?? 0,
    status:        mapStatus(r.trangThai),
    description:   r.maLoaiPhong?.moTa ?? "",
  };
}

// ── Room → PhongRequestApi để gửi lên API ────────────────────────────────────────
function mapToPhongDTO(room: Room): PhongRequestApi {
  return {
    id:          room.id,
    trangThai:   room.status,
    soTang:      room.floor,
    sucChua:     room.capacity,
    maLoaiPhong: room.loaiPhongId, // gửi ID loại phòng
  };
}

// ── API calls ─────────────────────────────────────────────────────────────
export async function getRooms(): Promise<Room[]> {
  const data = await apiClient<PhongResponseApi[]>("/api/rooms");
  return data.map(mapToRoom);
}

export async function getRoomById(id: number): Promise<Room> {
  const data = await apiClient<PhongResponseApi>(`/api/rooms/${id}`);
  return mapToRoom(data);
}

export async function createRoom(room: Room): Promise<Room> {
  const data = await apiClient<PhongResponseApi>("/api/rooms", {
    method: "POST",
    body: JSON.stringify(mapToPhongDTO(room)),
  });
  return mapToRoom(data);
}

export async function updateRoom(id: number, room: Room): Promise<Room> {
  const data = await apiClient<PhongResponseApi>(`/api/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapToPhongDTO(room)),
  });
  return mapToRoom(data);
}

export async function deleteRoom(id: number): Promise<void> {
  return apiClient<void>(`/api/rooms/${id}`, { method: "DELETE" });
}

export async function getRoomsTrash(): Promise<Room[]> {
  const data = await apiClient<PhongResponseApi[]>("/api/rooms/trash");
  return data.map(mapToRoom);
}

export async function restoreRoom(id: number): Promise<Room> {
  const data = await apiClient<PhongResponseApi>(`/api/rooms/${id}/restore`, {
    method: "PUT",
  });
  return mapToRoom(data);
}

export async function hardDeleteRoom(id: number): Promise<void> {
  return apiClient<void>(`/api/rooms/${id}/hard`, {
    method: "DELETE",
  });
}