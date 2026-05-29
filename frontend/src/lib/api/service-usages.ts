import { ServiceUsage } from "@/types/serviceUsage";
import { apiClient } from "./client";

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
  return apiClient<ServiceUsage[]>("/api/serviceusages");
}

export async function getServiceUsageById(id: number): Promise<ServiceUsage> {
  return apiClient<ServiceUsage>(`/api/serviceusages/${id}`);
}

export async function createServiceUsage(payload: ServiceUsageRequestPayload): Promise<ServiceUsage> {
  return apiClient<ServiceUsage>("/api/serviceusages", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateServiceUsage(id: number, payload: ServiceUsageRequestPayload): Promise<ServiceUsage> {
  return apiClient<ServiceUsage>(`/api/serviceusages/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export async function deleteServiceUsage(id: number): Promise<void> {
  return apiClient<void>(`/api/serviceusages/${id}`, { method: "DELETE" });
}
