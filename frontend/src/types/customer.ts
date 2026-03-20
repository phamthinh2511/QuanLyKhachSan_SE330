export type CustomerStatus = "Thường" | "VIP" | "Khách hàng thân thiết";

export interface Customer {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  address: string;
  email: string;
  idCard: string;
  status: CustomerStatus;
}