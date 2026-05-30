import { apiClient } from "./client";
import { Customer, CustomerStatus } from "@/types/customer";

export interface KhachhangApi {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  address: string;
  email: string;
  idCard: string;
  type: string;
}

function mapToCustomer(k: KhachhangApi): Customer {
  return {
    id: k.id,
    name: k.name,
    phone: k.phone,
    gender: k.gender,
    birthday: k.birthday,
    address: k.address,
    email: k.email,
    idCard: k.idCard,
    status: (k.type as CustomerStatus) || "Thường",
  };
}

function mapToDTO(c: Partial<Customer>): Partial<KhachhangApi> {
  return {
    name: c.name,
    phone: c.phone,
    gender: c.gender,
    birthday: c.birthday,
    address: c.address,
    email: c.email,
    idCard: c.idCard,
    type: c.status,
  };
}

// GET tất cả khách hàng
export async function getCustomers(): Promise<Customer[]> {
  const data = await apiClient<KhachhangApi[]>("/api/customers");
  return data.map(mapToCustomer);
}

// GET một khách hàng theo id
export async function getCustomerById(id: number): Promise<Customer> {
  const data = await apiClient<KhachhangApi>(`/api/customers/${id}`);
  return mapToCustomer(data);
}

// POST thêm mới
export async function createCustomer(data: Omit<Customer, "id">): Promise<Customer> {
  const res = await apiClient<KhachhangApi>("/api/customers", {
    method: "POST",
    body: JSON.stringify(mapToDTO(data)),
  });
  return mapToCustomer(res);
}

// PUT cập nhật
export async function updateCustomer(id: number, data: Omit<Customer, "id">): Promise<Customer> {
  const res = await apiClient<KhachhangApi>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapToDTO(data)),
  });
  return mapToCustomer(res);
}

// DELETE xóa
export async function deleteCustomer(id: number): Promise<void> {
  return apiClient<void>(`/api/customers/${id}`, {
    method: "DELETE",
  });
}