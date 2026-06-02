import { apiClient } from "./client";
import { Invoice } from "@/types/invoice";
import { getToken } from "@/lib/auth";

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

export async function exportInvoices(): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const token = getToken();
  const res = await fetch(`${API_URL}/api/invoices/export`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) {
    throw new Error("Lỗi khi tải tệp xuất hóa đơn.");
  }
  return res.blob();
}

export async function exportRevenueReport(): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const token = getToken();
  const res = await fetch(`${API_URL}/api/invoices/revenue-report/export`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) {
    throw new Error("Lỗi khi tải tệp xuất báo cáo doanh thu.");
  }
  return res.blob();
}
