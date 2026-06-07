/**
 * @file Custom hook for managing service usage data.
 */
import { useState, useEffect, useCallback } from "react";
import { ServiceUsage } from "@/types/serviceUsage";
import {
  getServiceUsages,
  createServiceUsage,
  updateServiceUsage,
  deleteServiceUsage,
  ServiceUsageRequestPayload,
} from "@/lib/api/service-usages";

export function useServiceUsages() {
  const [serviceUsages, setServiceUsages] = useState<ServiceUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceUsages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceUsages();
      setServiceUsages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách sử dụng dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceUsages();
  }, [fetchServiceUsages]);

  const addServiceUsage = async (payload: ServiceUsageRequestPayload) => {
    try {
      const newUsage = await createServiceUsage(payload);
      setServiceUsages((prev) => [...prev, newUsage]);
      return newUsage;
    } catch (err) {
      console.error("Failed to add service usage:", err);
      throw err;
    }
  };

  const editServiceUsage = async (id: number, payload: ServiceUsageRequestPayload) => {
    try {
      const updatedUsage = await updateServiceUsage(id, payload);
      setServiceUsages((prev) =>
        prev.map((usage) => (usage.id === id ? updatedUsage : usage))
      );
      return updatedUsage;
    } catch (err) {
      console.error("Failed to update service usage:", err);
      throw err;
    }
  };

  const removeServiceUsage = async (id: number) => {
    try {
      await deleteServiceUsage(id);
      setServiceUsages((prev) => prev.filter((usage) => usage.id !== id));
    } catch (err) {
      console.error("Failed to delete service usage:", err);
      throw err;
    }
  };

  return {
    serviceUsages,
    loading,
    error,
    refetch: fetchServiceUsages,
    addServiceUsage,
    editServiceUsage,
    removeServiceUsage,
  };
}
