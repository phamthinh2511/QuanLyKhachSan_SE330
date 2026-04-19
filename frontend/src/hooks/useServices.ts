"use client";

import { useState, useEffect, useCallback } from "react";
import { Service } from "@/types/service";
import {
  getServices, createService,
  updateService, deleteService,
} from "@/lib/api/services";

export function useServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getServices();
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchServices(); }, [fetchServices]);

  const handleCreate = async (service: Omit<Service, "id" | "serviceCode">) => {
    const created = await createService(service);
    setServices((prev) => [...prev, created]);
  };

  const handleUpdate = async (
    id: number,
    service: Omit<Service, "id" | "serviceCode">
  ) => {
    const updated = await updateService(id, service);
    setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const handleDelete = async (id: number) => {
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return {
    services, loading, error,
    refetch: fetchServices,
    handleCreate, handleUpdate, handleDelete,
  };
}