import { apiClient } from "./client";
import { Customer } from "@/types/customer";

// GET tất cả khách hàng
export async function getCustomers(): Promise<Customer[]> {
  return apiClient<Customer[]>("/api/customers");
}

// GET một khách hàng theo id
export async function getCustomerById(id: number): Promise<Customer> {
  return apiClient<Customer>(`/api/customers/${id}`);
}

// POST thêm mới
export async function createCustomer(data: Omit<Customer, "id">): Promise<Customer> {
  return apiClient<Customer>("/api/customers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT cập nhật
export async function updateCustomer(id: number, data: Omit<Customer, "id">): Promise<Customer> {
  return apiClient<Customer>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE xóa
export async function deleteCustomer(id: number): Promise<void> {
  return apiClient<void>(`/api/customers/${id}`, {
    method: "DELETE",
  });
}