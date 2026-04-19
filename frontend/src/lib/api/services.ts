import { Service } from "@/types/service";
import { ServiceCategory } from "@/types/service";
import { apiClient } from "./client";

export interface DichvuApi{
    id: number,
    tenDichVu: string,
    moTa: string,
    giaDichVu: number    
} 

function guessCategory(tenDichVu: string): ServiceCategory{
    const name = tenDichVu.toLowerCase();
    if(name.includes("bữa sáng") || name.includes("bữa trưa") || name.includes("bữa tối") || name.includes("ăn") || name.includes("uống") || name.includes("breakfast") || name.includes("food") || name.includes("drink") || name.includes("room service")){
        return "Ăn uống"; // Ăn uống
    }
    if(name.includes("giặt") || name.includes("thay ga") || name.includes("vệ sinh") || name.includes("dọn") || name.includes("lau") || name.includes("laundry") || name.includes("clean")){
        return "Phòng"; // Phòng
    }
    if(name.includes("gym") || name.includes("spa") || name.includes("yoga") || name.includes("thiền") || name.includes("massage")){
        return "Sức khoẻ"; // Sức khoẻ
    }
    if(name.includes("sân bay") || name.includes("taxi") || name.includes("đưa") || name.includes("đón") || name.includes("xe")){
        return "Đưa đón"; // Sức khoẻ
    }
    return "Khác";
}

// DichvuApi -> Service
function mapToService(d: DichvuApi): Service{
    return {
    id:          d.id,
    serviceCode: `SRV-${String(d.id).padStart(3, "0")}`,
    name:        d.tenDichVu,
    price:       d.giaDichVu,
    description: d.moTa,
    category:    guessCategory(d.tenDichVu),
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