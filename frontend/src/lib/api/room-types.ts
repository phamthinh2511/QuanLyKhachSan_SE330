import { apiClient } from "./client";
import { RoomTypeModel } from "@/types/room-type";

export async function getRoomTypes(): Promise<RoomTypeModel[]> {
  return apiClient<RoomTypeModel[]>("/api/room-types");
}

export async function getRoomTypeById(id: number): Promise<RoomTypeModel> {
  return apiClient<RoomTypeModel>(`/api/room-types/${id}`);
}

export async function createRoomType(data: Omit<RoomTypeModel, "id">): Promise<RoomTypeModel> {
  return apiClient<RoomTypeModel>("/api/room-types", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateRoomType(id: number, data: Omit<RoomTypeModel, "id">): Promise<RoomTypeModel> {
  return apiClient<RoomTypeModel>(`/api/room-types/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteRoomType(id: number): Promise<void> {
  return apiClient<void>(`/api/room-types/${id}`, {
    method: "DELETE",
  });
}
