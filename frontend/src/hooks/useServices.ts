"use client";

import { useState, useEffect, useCallback } from "react";
import { Service } from "@/types/service";
import {
  getServices, createService,
  updateService, deleteService,
} from "@/lib/api/services";

// Module-level cache
let servicesCache: Service[] | null = null;

export function useServices() {
  const [services, setServices] = useState<Service[]>(() => servicesCache || []);
  const [loading, setLoading] = useState(() => !servicesCache);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async (force = false) => {
    if (!servicesCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getServices();
      servicesCache = data;
      setServices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreate = async (service: Omit<Service, "id" | "serviceCode">) => {
    const created = await createService(service);
    servicesCache = [...(servicesCache || []), created];
    setServices(servicesCache);
  };

  const handleUpdate = async (
    id: number,
    service: Omit<Service, "id" | "serviceCode">
  ) => {
    const updated = await updateService(id, service);
    servicesCache = (servicesCache || []).map((s) => (s.id === id ? updated : s));
    setServices(servicesCache);
  };

  const handleDelete = async (id: number) => {
    await deleteService(id);
    servicesCache = (servicesCache || []).filter((s) => s.id !== id);
    setServices(servicesCache);
  };

  return {
    services,
    loading,
    error,
    refetch: () => fetchServices(true),
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}