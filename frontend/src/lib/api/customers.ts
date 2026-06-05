/**
 * @file API calls for Customer management.
 * This file follows the standard API layer architecture.
 */
import { apiClient, ApiResponse } from "./client";
import { Customer, CustomerStatus } from "@/types/customer";

// --- DTO Definition ---
// This interface must match KhachhangResponseDto.java
export interface KhachhangDto {
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

// --- Mapper Functions ---

function mapDtoToCustomer(dto: KhachhangDto): Customer {
  return {
    id: dto.id,
    name: dto.name,
    phone: dto.phone,
    gender: dto.gender,
    birthday: dto.birthday,
    address: dto.address,
    email: dto.email,
    idCard: dto.idCard,
    status: (dto.type as CustomerStatus) || "Thường",
  };
}

function mapCustomerToDto(customer: Partial<Customer>): Partial<KhachhangDto> {
  return {
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender,
    birthday: customer.birthday,
    address: customer.address,
    email: customer.email,
    idCard: customer.idCard,
    type: customer.status,
  };
}

// --- API Calls ---

export async function getCustomers(): Promise<Customer[]> {
  const response = await apiClient<ApiResponse<KhachhangDto[]>>("/api/customers");
  return (response.result || []).map(mapDtoToCustomer);
}

export async function getCustomerById(id: number): Promise<Customer> {
  const response = await apiClient<ApiResponse<KhachhangDto>>(`/api/customers/${id}`);
  return mapDtoToCustomer(response.result);
}

export async function createCustomer(data: Omit<Customer, "id">): Promise<Customer> {
  const response = await apiClient<ApiResponse<KhachhangDto>>("/api/customers", {
    method: "POST",
    body: JSON.stringify(mapCustomerToDto(data)),
  });
  return mapDtoToCustomer(response.result);
}

export async function updateCustomer(id: number, data: Omit<Customer, "id">): Promise<Customer> {
  const response = await apiClient<ApiResponse<KhachhangDto>>(`/api/customers/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapCustomerToDto(data)),
  });
  return mapDtoToCustomer(response.result);
}

export async function deleteCustomer(id: number): Promise<void> {
  await apiClient<ApiResponse<void>>(`/api/customers/${id}`, {
    method: "DELETE",
  });
}
