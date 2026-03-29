"use client";

import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/types/customer";
import {
  getCustomers, createCustomer,
  updateCustomer, deleteCustomer,
} from "@/lib/api/customers";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách
  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // Thêm mới
  const handleCreate = async (data: Omit<Customer, "id">) => {
    const created = await createCustomer(data);
    setCustomers((prev) => [...prev, created]);
  };

  // Cập nhật
  const handleUpdate = async (id: number, data: Omit<Customer, "id">) => {
    const updated = await updateCustomer(id, data);
    setCustomers((prev) => prev.map((c) => (c.id === id ? updated : c)));
  };

  // Xóa
  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  };

  return { customers, loading, error, refetch: fetchCustomers, handleCreate, handleUpdate, handleDelete };
}