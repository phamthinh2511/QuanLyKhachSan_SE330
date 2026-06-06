import { apiClient } from "./client";
import { Account } from "@/types/account";

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export async function getAccountsTrash(): Promise<Account[]> {
  const data = await apiClient<ApiResponse<Account[]>>("/api/accounts/trash");
  return data.result || [];
}

export async function restoreAccount(id: number): Promise<Account> {
  const data = await apiClient<ApiResponse<Account>>(`/api/accounts/${id}/restore`, {
    method: "PUT",
  });
  return data.result;
}

export async function hardDeleteAccount(id: number): Promise<void> {
  await apiClient<ApiResponse<void>>(`/api/accounts/${id}/hard`, {
    method: "DELETE",
  });
}
