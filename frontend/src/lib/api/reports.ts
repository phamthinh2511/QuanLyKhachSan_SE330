/**
 * @file API calls for Reports.
 * This file follows the standard API layer architecture.
 */
import { apiClient } from "./client";
import { getToken } from "@/lib/auth";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

// --- DTO Definition ---
// Matches ReportResponseDto.java
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

// --- API Calls ---

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
  const response = await apiClient<ApiResponse<ReportData>>("/api/reports", {
    params: queryParams,
  });
  return response.result;
}

// --- Export Functions (Do not use apiClient) ---

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
