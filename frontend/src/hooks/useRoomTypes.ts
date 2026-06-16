import { useState, useEffect, useCallback } from "react";
import { RoomTypeModel } from "@/types/room-type";
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType } from "@/lib/api/room-types";

// Module-level cache
let roomTypesCache: RoomTypeModel[] | null = null;

export function useRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeModel[]>(() => roomTypesCache || []);
  const [loading, setLoading] = useState(() => !roomTypesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomTypes = useCallback(async (force = false) => {
    if (!roomTypesCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getRoomTypes();
      roomTypesCache = data;
      setRoomTypes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh mục loại phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoomTypes();
  }, [fetchRoomTypes]);

  const handleCreate = async (data: Omit<RoomTypeModel, "id">) => {
    const newRt = await createRoomType(data);
    roomTypesCache = [...(roomTypesCache || []), newRt];
    setRoomTypes(roomTypesCache);
    return newRt;
  };

  const handleUpdate = async (id: number, data: Omit<RoomTypeModel, "id">) => {
    const updatedRt = await updateRoomType(id, data);
    roomTypesCache = (roomTypesCache || []).map((rt) => (rt.id === id ? updatedRt : rt));
    setRoomTypes(roomTypesCache);
    return updatedRt;
  };

  const handleDelete = async (id: number) => {
    await deleteRoomType(id);
    roomTypesCache = (roomTypesCache || []).filter((rt) => rt.id !== id);
    setRoomTypes(roomTypesCache);
  };

  return {
    roomTypes,
    loading,
    error,
    refetch: () => fetchRoomTypes(true),
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
