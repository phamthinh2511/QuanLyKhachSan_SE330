import { Service } from "@/types/service";
import { apiClient } from "./client";

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
  const data = await apiClient<DichvuApi[]>("/api/services");
  return data.map(mapToService);
}

export async function getServiceById(id: number): Promise<Service> {
  const data = await apiClient<DichvuApi>(`/api/services/${id}`);
  return mapToService(data);
}

export async function createService(
  service: Omit<Service, "id" | "serviceCode">
): Promise<Service> {
  const data = await apiClient<DichvuApi>("/api/services", {
    method: "POST",
    body: JSON.stringify(mapToDTO(service)),
  });
  return mapToService(data);
}

export async function updateService(
  id: number,
  service: Omit<Service, "id" | "serviceCode">
): Promise<Service> {
  const data = await apiClient<DichvuApi>(`/api/services/${id}`, {
    method: "PUT",
    body: JSON.stringify(mapToDTO(service)),
  });
  return mapToService(data);
}

export async function deleteService(id: number): Promise<void> {
  return apiClient<void>(`/api/services/${id}`, { method: "DELETE" });
}