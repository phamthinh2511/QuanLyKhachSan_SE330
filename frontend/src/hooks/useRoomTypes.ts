import { useState, useEffect, useCallback } from "react";
import { RoomTypeModel } from "@/types/room-type";
import { getRoomTypes, createRoomType, updateRoomType, deleteRoomType } from "@/lib/api/room-types";

export function useRoomTypes() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoomTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRoomTypes();
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
    setRoomTypes((prev) => [...prev, newRt]);
    return newRt;
  };

  const handleUpdate = async (id: number, data: Omit<RoomTypeModel, "id">) => {
    const updatedRt = await updateRoomType(id, data);
    setRoomTypes((prev) => prev.map((rt) => (rt.id === id ? updatedRt : rt)));
    return updatedRt;
  };

  const handleDelete = async (id: number) => {
    await deleteRoomType(id);
    setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
  };

  return {
    roomTypes,
    loading,
    error,
    refetch: fetchRoomTypes,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}
