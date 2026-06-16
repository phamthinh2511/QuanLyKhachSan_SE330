import { useState, useEffect, useCallback } from "react";
import { RentalSlip, getRentals, deleteRental } from "@/lib/api/rentals";

// Module-level cache
let rentalsCache: RentalSlip[] | null = null;

export function useRentals() {
  const [rentals, setRentals] = useState<RentalSlip[]>(() => rentalsCache || []);
  const [loading, setLoading] = useState(() => !rentalsCache);
  const [error, setError] = useState<string | null>(null);

  const fetchRentals = useCallback(async (force = false) => {
    if (!rentalsCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getRentals();
      rentalsCache = data || [];
      setRentals(rentalsCache);
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
      // Silently fetch to update cache
      await fetchRentals(false);
    } catch (err: any) {
      throw new Error(err.message || "Lỗi khi xóa phiếu thuê phòng");
    }
  };

  return {
    rentals,
    loading,
    error,
    refresh: () => fetchRentals(true),
    removeRental
  };
}
