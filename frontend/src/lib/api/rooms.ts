import { apiClient } from "./client";
import { Room, RoomType, RoomStatus } from "@/types/room";

// ── Interface khớp với PhongDTO Java ─────────────────────────────────────
export interface LoaiphongApi {
  id: number;
  tenLoaiPhong: string;
  donGia: number;        // ← donGia
  moTa: string;
  sucChuaToiDa: number;  // ← sucChuaToiDa
}

export interface PhongApi {
  id: number;
  trangThai: string;
  soTang: number;
  sucChua: number;
  loaiPhong: LoaiphongApi;
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

// ── Map tenLoaiPhong DB → RoomType TypeScript ────────────────────────────
function mapType(tenLoaiPhong: string): RoomType {
  const map: Record<string, RoomType> = {
    "Thường":     "Thường",
    "Cao cấp":       "Cao cấp",
    "Sang trọng":        "Sang trọng",
    "Presidential": "Presidential",
  };
  return map[tenLoaiPhong] ?? "Thường";
}

// ── PhongApi → Room ───────────────────────────────────────────────────────
function mapToRoom(r: PhongApi): Room {
  return {
    id:            r.id,
    roomNumber:    String(r.id),
    type:          mapType(r.loaiPhong?.tenLoaiPhong ?? ""),
    floor:         r.soTang,
    capacity:      r.sucChua,
    pricePerNight: r.loaiPhong?.donGia ?? 0,   // ← donGia
    status:        mapStatus(r.trangThai),
    description:   r.loaiPhong?.moTa ?? "",
  };
}

// ── Room → PhongDTO để gửi lên API ────────────────────────────────────────
function mapToPhongDTO(room: Room): Partial<PhongApi> {
  return {
    id:        room.id,
    trangThai: room.status,
    soTang:    room.floor,
    sucChua:   room.capacity,
    loaiPhong: {
      id:            0,
      tenLoaiPhong:  room.type,
      donGia:        room.pricePerNight,  // ← donGia
      moTa:          room.description,
      sucChuaToiDa:  room.capacity,       // ← sucChuaToiDa
    },
  };
}

// ── API calls ─────────────────────────────────────────────────────────────
export async function getRooms(): Promise<Room[]> {
  const data = await apiClient<PhongApi[]>("/api/rooms");
  return data.map(mapToRoom);
}

export async function getRoomById(id: number): Promise<Room> {
  const data = await apiClient<PhongApi>(`/api/rooms/${id}`);
  return mapToRoom(data);
}

export async function createRoom(room: Room): Promise<Room> {
  const data = await apiClient<PhongApi>("/api/rooms", {
    method: "POST",
    body: JSON.stringify(mapToPhongDTO(room)),
  });
  return mapToRoom(data);
}

export async function updateRoom(id: number, room: Room): Promise<Room> {
  const data = await apiClient<PhongApi>(`/api/rooms/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapToPhongDTO(room)),
  });
  return mapToRoom(data);
}

export async function deleteRoom(id: number): Promise<void> {
  return apiClient<void>(`/api/rooms/${id}`, { method: "DELETE" });
}