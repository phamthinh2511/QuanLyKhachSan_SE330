"use client";

import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/types/customer";
import {
  getCustomers, createCustomer,
  updateCustomer, deleteCustomer,
} from "@/lib/api/customers";

// Module-level cache
let customersCache: Customer[] | null = null;

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(() => customersCache || []);
  const [loading, setLoading] = useState(() => !customersCache);
  const [error, setError] = useState<string | null>(null);

  // Fetch danh sách
  const fetchCustomers = useCallback(async (force = false) => {
    if (!customersCache || force) {
      setLoading(true);
    }
    setError(null);
    try {
      const data = await getCustomers();
      customersCache = data;
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu khách hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  // Thêm mới
  const handleCreate = async (data: Omit<Customer, "id">) => {
    const created = await createCustomer(data);
    customersCache = [...(customersCache || []), created];
    setCustomers(customersCache);
  };

  // Cập nhật
  const handleUpdate = async (id: number, data: Omit<Customer, "id">) => {
    const updated = await updateCustomer(id, data);
    customersCache = (customersCache || []).map((c) => (c.id === id ? updated : c));
    setCustomers(customersCache);
  };

  // Xóa
  const handleDelete = async (id: number) => {
    await deleteCustomer(id);
    customersCache = (customersCache || []).filter((c) => c.id !== id);
    setCustomers(customersCache);
  };

  return {
    customers,
    loading,
    error,
    refetch: () => fetchCustomers(true),
    handleCreate,
    handleUpdate,
    handleDelete
  };
}