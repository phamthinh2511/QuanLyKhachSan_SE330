"use client";

import { useState, useEffect, useCallback } from "react";
import { Room } from "@/types/room";
import { getRooms, createRoom, updateRoom, deleteRoom } from "@/lib/api/rooms";

// Module-level cache
let roomsCache: Room[] | null = null;

export function useRooms() {
  const [rooms, setRooms] = useState<Room[]>(() => roomsCache || []);
  const [loading, setLoading] = useState(() => !roomsCache);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = useCallback(async (force = false) => {
    if (!roomsCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getRooms();
      roomsCache = data;
      setRooms(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu danh sách phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const handleCreate = async (room: Room) => {
    const created = await createRoom(room);
    roomsCache = [...(roomsCache || []), created];
    setRooms(roomsCache);
  };

  const handleUpdate = async (id: number, room: Room) => {
    const updated = await updateRoom(id, room);
    roomsCache = (roomsCache || []).map((r) => (r.id === id ? updated : r));
    setRooms(roomsCache);
  };

  const handleDelete = async (id: number) => {
    await deleteRoom(id);
    roomsCache = (roomsCache || []).filter((r) => r.id !== id);
    setRooms(roomsCache);
  };

  return {
    rooms,
    loading,
    error,
    refetch: () => fetchRooms(true),
    handleCreate,
    handleUpdate,
    handleDelete
  };
}