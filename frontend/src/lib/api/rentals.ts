import { apiClient } from "./client";

export interface RentalSlip {
  id: number;
  rentalCode: string;
  bookingCode: string;
  customerId: number;
  customerName: string;
  employeeId: number;
  employeeName: string;
  roomNumber: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomPrice: number;
  status: string;
  serviceUsages?: Array<{
    id: number;
    usageCode: string;
    bookingCode: string;
    customerName: string;
    roomNumber: string;
    serviceName: string;
    quantity: number;
    unitPrice: number;
    total: number;
    date: string;
    status: string;
  }>;
}

export async function getRentals(): Promise<RentalSlip[]> {
  return apiClient<RentalSlip[]>("/api/rentals");
}

export async function getRentalById(id: number): Promise<RentalSlip> {
  return apiClient<RentalSlip>(`/api/rentals/${id}`);
}

export async function deleteRental(id: number): Promise<void> {
  return apiClient<void>(`/api/rentals/${id}`, { method: "DELETE" });
}
