/**
 * @file Custom hook for managing employee data.
 * This follows the standard hook architecture for data fetching and manipulation.
 */
import { useState, useEffect, useCallback } from "react";
import { Employee } from "@/types/employee";
import { employeesApi } from "@/lib/api/employees";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeesApi.getAll();
      setEmployees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra khi tải danh sách nhân viên");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const createEmployee = async (employeeData: Partial<Employee>) => {
    try {
      const newEmployee = await employeesApi.create(employeeData);
      setEmployees((prev) => [...prev, newEmployee]);
      return newEmployee;
    } catch (err) {
      console.error("Failed to create employee:", err);
      // Re-throw the error to be caught by the component
      throw err;
    }
  };

  const updateEmployee = async (id: number, employeeData: Partial<Employee>) => {
    try {
      const updatedEmployee = await employeesApi.update(id, employeeData);
      setEmployees((prev) =>
        prev.map((emp) => (emp.id === id ? updatedEmployee : emp))
      );
      return updatedEmployee;
    } catch (err) {
      console.error("Failed to update employee:", err);
      throw err;
    }
  };

  const deleteEmployee = async (id: number) => {
    try {
      await employeesApi.delete(id);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    } catch (err) {
      console.error("Failed to delete employee:", err);
      throw err;
    }
  };

  return {
    employees,
    loading,
    error,
    refetch: fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
  };
}
