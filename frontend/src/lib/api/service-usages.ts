import { ServiceUsage } from "@/types/serviceUsage";
import { apiClient } from "./client";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface ServiceUsageRequestPayload {
  bookingCode: string;
  roomNumber: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  date: string;
  status: string;
}

export async function getServiceUsages(): Promise<ServiceUsage[]> {
  const data = await apiClient<ApiResponse<ServiceUsage[]>>("/api/serviceusages");
  return data.result || [];
}

export async function getServiceUsageById(id: number): Promise<ServiceUsage> {
  const data = await apiClient<ApiResponse<ServiceUsage>>(`/api/serviceusages/${id}`);
  return data.result;
}

export async function createServiceUsage(payload: ServiceUsageRequestPayload): Promise<ServiceUsage> {
  const data = await apiClient<ApiResponse<ServiceUsage>>("/api/serviceusages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data.result;
}

export async function updateServiceUsage(id: number, payload: ServiceUsageRequestPayload): Promise<ServiceUsage> {
  const data = await apiClient<ApiResponse<ServiceUsage>>(`/api/serviceusages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  return data.result;
}

export async function deleteServiceUsage(id: number): Promise<void> {
  await apiClient<ApiResponse<void>>(`/api/serviceusages/${id}`, { method: "DELETE" });
}
