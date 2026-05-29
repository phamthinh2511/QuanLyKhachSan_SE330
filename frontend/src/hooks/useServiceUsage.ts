import { useState, useEffect, useCallback } from "react";
import { ServiceUsage } from "@/types/serviceUsage";
import { getServiceUsages, createServiceUsage, updateServiceUsage, deleteServiceUsage, ServiceUsageRequestPayload } from "@/lib/api/service-usages";

export function useServiceUsage() {
  const [usages, setUsages] = useState<ServiceUsage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getServiceUsages();
      setUsages(data || []);
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
      await fetchUsages();
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi lưu bản ghi sử dụng dịch vụ");
    }
  };

  const removeUsage = async (id: number) => {
    try {
      await deleteServiceUsage(id);
      await fetchUsages();
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi xóa bản ghi sử dụng dịch vụ");
    }
  };

  return { usages, loading, error, refresh: fetchUsages, saveUsage, removeUsage };
}
