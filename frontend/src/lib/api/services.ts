import { Service } from "@/types/service";
import { apiClient } from "./client";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface DichvuApi{
    id: number,
    tenDichVu: string,
    moTa: string,
    giaDichVu: number    
} 

// DichvuApi -> Service
function mapToService(d: DichvuApi): Service{
    return {
    id:          d.id,
    serviceCode: `SRV-${String(d.id).padStart(3, "0")}`,
    name:        d.tenDichVu,
    price:       d.giaDichVu,
    description: d.moTa,
  };
}

function mapToDTO(service: Omit<Service, "id" | "serviceCode">): DichvuApi {
  return {
    id:         0,
    tenDichVu:  service.name,
    giaDichVu:  service.price,
    moTa:       service.description,
  };
}

// ── API calls ─────────────────────────────────────────────────────────────
export async function getServices(): Promise<Service[]> {
  const data = await apiClient<ApiResponse<DichvuApi[]>>("/api/services");
  return (data.result || []).map(mapToService);
}

export async function getServiceById(id: number): Promise<Service> {
  const data = await apiClient<ApiResponse<DichvuApi>>(`/api/services/${id}`);
  return mapToService(data.result);
}

export async function createService(
  service: Omit<Service, "id" | "serviceCode">
): Promise<Service> {
  const data = await apiClient<ApiResponse<DichvuApi>>("/api/services", {
    method: "POST",
    body: JSON.stringify(mapToDTO(service)),
  });
  return mapToService(data.result);
}

export async function updateService(
  id: number,
  service: Omit<Service, "id" | "serviceCode">
): Promise<Service> {
  const data = await apiClient<ApiResponse<DichvuApi>>(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapToDTO(service)),
  });
  return mapToService(data.result);
}

export async function deleteService(id: number): Promise<void> {
  await apiClient<ApiResponse<void>>(`/api/services/${id}`, { method: "DELETE" });
}

export async function getServicesTrash(): Promise<Service[]> {
  const data = await apiClient<ApiResponse<DichvuApi[]>>("/api/services/trash");
  return (data.result || []).map(mapToService);
}

export async function restoreService(id: number): Promise<Service> {
  const data = await apiClient<ApiResponse<DichvuApi>>(`/api/services/${id}/restore`, {
    method: "PUT",
  });
  return mapToService(data.result);
}

export async function hardDeleteService(id: number): Promise<void> {
  await apiClient<ApiResponse<void>>(`/api/services/${id}/hard`, { method: "DELETE" });
}