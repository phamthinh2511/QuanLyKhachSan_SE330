import { apiClient } from "./client";
import { Invoice } from "@/types/invoice";

export interface CreateInvoicePayload {
  bookingCode: string;
  paymentMethod: string;
}

export async function getAllInvoices(): Promise<Invoice[]> {
  return apiClient<Invoice[]>("/api/invoices");
}

export async function getInvoiceById(id: number): Promise<Invoice> {
  return apiClient<Invoice>(`/api/invoices/${id}`);
}

export async function createInvoice(payload: CreateInvoicePayload): Promise<Invoice> {
  return apiClient<Invoice>("/api/invoices", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteInvoice(id: number): Promise<void> {
  return apiClient<void>(`/api/invoices/${id}`, {
    method: "DELETE",
  });
}

export async function updateInvoice(id: number, payload: Partial<Invoice>): Promise<Invoice> {
  return apiClient<Invoice>(`/api/invoices/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
