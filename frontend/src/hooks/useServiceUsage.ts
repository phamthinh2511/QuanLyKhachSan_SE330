"use client";

import { useState, useEffect, useCallback } from "react";
import { ServiceUsage } from "@/types/serviceUsage";
import { getServiceUsages, createServiceUsage, updateServiceUsage, deleteServiceUsage, ServiceUsageRequestPayload } from "@/lib/api/service-usages";

// Module-level cache
let serviceUsageCache: ServiceUsage[] | null = null;

export function useServiceUsage() {
  const [usages, setUsages] = useState<ServiceUsage[]>(() => serviceUsageCache || []);
  const [loading, setLoading] = useState(() => !serviceUsageCache);
  const [error, setError] = useState<string | null>(null);

  const fetchUsages = useCallback(async (force = false) => {
    if (!serviceUsageCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getServiceUsages();
      serviceUsageCache = data || [];
      setUsages(serviceUsageCache);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách sử dụng dịch vụ");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsages();
  }, [fetchUsages]);

  const saveUsage = async (id: number | null, data: ServiceUsageRequestPayload) => {
    try {
      if (id && id !== 0) {
        await updateServiceUsage(id, data);
      } else {
        await createServiceUsage(data);
      }
      await fetchUsages(false);
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi lưu bản ghi sử dụng dịch vụ");
    }
  };

  const removeUsage = async (id: number) => {
    try {
      await deleteServiceUsage(id);
      await fetchUsages(false);
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi xóa bản ghi sử dụng dịch vụ");
    }
  };

  return { usages, loading, error, refresh: () => fetchUsages(true), saveUsage, removeUsage };
}
