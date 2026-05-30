"use client";

import { useState, useEffect, useCallback } from "react";
import { Room } from "@/types/room";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api/rooms";

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRooms();
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleCreate = async (room: Room) => {
    const created = await createRoom(room);
    setRooms((prev) => [...prev, created]);
  };

  const handleUpdate = async (id: number, room: Room) => {
    const updated = await updateRoom(id, room);
    setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleDelete = async (id: number) => {
    await deleteRoom(id);
    setRooms((prev) => prev.filter((r) => r.id !== id));
  };

  return { rooms, loading, error, refetch: fetchRooms, handleCreate, handleUpdate, handleDelete };
}