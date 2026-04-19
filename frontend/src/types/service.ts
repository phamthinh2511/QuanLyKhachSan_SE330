export type ServiceCategory = "Ăn uống" | "Phòng" | "Sức khoẻ" | "Đưa đón" | "Khác";

export interface Service {
  id: number;
  serviceCode: string;
  name: string;
  category: ServiceCategory;
  price: number;
  description: string;
}