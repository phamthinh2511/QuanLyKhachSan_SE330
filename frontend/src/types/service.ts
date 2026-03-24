export type ServiceCategory = "Ăn uống" | "Phòng" | "Spa" | "Đưa đón" | "Khác";

export interface Service {
  id: number;
  serviceCode: string;
  name: string;
  category: ServiceCategory;
  price: number;
  description: string;
}