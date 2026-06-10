import { apiClient } from "./client";
import { Invoice } from "@/types/invoice";
import { getToken } from "@/lib/auth";

export interface CreateInvoicePayload {
  bookingCode: string;
  paymentMethod: string;
}

export interface PaginatedInvoices {
  content: Invoice[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  totalCount: number;
  paidAmount: number;
  pendingAmount: number;
}

export async function getAllInvoices(): Promise<Invoice[]> {
  return apiClient<Invoice[]>("/api/invoices");
}

export async function getPagedInvoices(params: {
  year?: number;
  month?: number;
  search?: string;
  status?: string;
  sortDir?: string;
  page: number;
  size: number;
}): Promise<PaginatedInvoices> {
  const queryParams: Record<string, string> = {
    page: String(params.page),
    size: String(params.size),
  };
  if (params.year !== undefined) queryParams.year = String(params.year);
  if (params.month !== undefined) queryParams.month = String(params.month);
  if (params.search !== undefined && params.search.trim() !== "") {
    queryParams.search = params.search.trim();
  }
  if (params.status !== undefined && params.status !== "Tất cả") {
    queryParams.status = params.status;
  }
  if (params.sortDir) {
    queryParams.sortDir = params.sortDir;
  }

  return apiClient<PaginatedInvoices>("/api/invoices/paged", {
    params: queryParams,
  });
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

export async function exportInvoices(year?: number, month?: number): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const token = getToken();

  const url = new URL(`${API_URL}/api/invoices/export`);
  if (year !== undefined) url.searchParams.append("year", String(year));
  if (month !== undefined) url.searchParams.append("month", String(month));

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) {
    throw new Error("Lỗi khi tải tệp xuất hóa đơn.");
  }
  return res.blob();
}

export async function exportRevenueReport(params: {
  type: "month" | "quarter" | "year";
  year: number;
  value?: number;
}): Promise<Blob> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
  const token = getToken();

  const url = new URL(`${API_URL}/api/invoices/revenue-report/export`);
  url.searchParams.append("type", params.type);
  url.searchParams.append("year", String(params.year));
  if (params.value !== undefined) {
    url.searchParams.append("value", String(params.value));
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
  if (!res.ok) {
    throw new Error("Lỗi khi tải tệp xuất báo cáo doanh thu.");
  }
  return res.blob();
}

export interface ReportData {
  revenue: number;
  profit: number;
  occupancy: number;
  guests: number;
  expenses: number;
  chartData: {
    labels: string[];
    revenue: number[];
    profit: number[];
    occupancy: number[];
    guests: number[];
  };
}

export async function getReportData(params: {
  type: "month" | "quarter" | "year";
  year: number;
  value?: number;
}): Promise<ReportData> {
  const queryParams: Record<string, string> = {
    type: params.type,
    year: String(params.year),
  };
  if (params.value !== undefined) {
    queryParams.value = String(params.value);
  }

  return apiClient<ReportData>("/api/reports", {
    params: queryParams,
  });
}
