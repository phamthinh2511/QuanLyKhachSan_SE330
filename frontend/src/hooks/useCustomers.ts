/**
 * @file Custom hook for managing customer data.
 */
import { useState, useEffect, useCallback } from "react";
import { Customer } from "@/types/customer";
import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "@/lib/api/customers";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách khách hàng");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const addCustomer = async (customerData: Omit<Customer, "id">) => {
    try {
      const newCustomer = await createCustomer(customerData);
      setCustomers((prev) => [...prev, newCustomer]);
      return newCustomer;
    } catch (err) {
      console.error("Failed to create customer:", err);
      throw err;
    }
  };

  const editCustomer = async (id: number, customerData: Omit<Customer, "id">) => {
    try {
      const updatedCustomer = await updateCustomer(id, customerData);
      setCustomers((prev) =>
        prev.map((cust) => (cust.id === id ? updatedCustomer : cust))
      );
      return updatedCustomer;
    } catch (err) {
      console.error("Failed to update customer:", err);
      throw err;
    }
  };

  const removeCustomer = async (id: number) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((cust) => cust.id !== id));
    } catch (err) {
      console.error("Failed to delete customer:", err);
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
    addCustomer,
    editCustomer,
    removeCustomer,
  };
}
