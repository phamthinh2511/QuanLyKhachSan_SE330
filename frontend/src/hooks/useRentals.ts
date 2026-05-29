import { useState, useEffect, useCallback } from "react";
import { RentalSlip, getRentals, deleteRental } from "@/lib/api/rentals";

export function useRentals() {
  const [rentals, setRentals] = useState<RentalSlip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRentals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getRentals();
      setRentals(data || []);
    } catch (err: any) {
      setError(err.message || "Không thể tải danh sách phiếu thuê phòng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRentals();
  }, [fetchRentals]);

  const removeRental = async (id: number) => {
    try {
      await deleteRental(id);
      await fetchRentals();
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi xóa phiếu thuê phòng");
    }
  };

  return { rentals, loading, error, refresh: fetchRentals, removeRental };
}
