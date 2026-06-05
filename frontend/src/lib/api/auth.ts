/**
 * @file API calls for Authentication.
 * This file uses apiClient but returns the full ApiResponse
 * so the login component can react to different codes and messages.
 */
import { apiClient, ApiResponse } from "./client";

export interface LoginPayload {
  username: string;
  password: string;
}

// The response for a login request is the full ApiResponse containing the token.
export type LoginResponse = ApiResponse<string>;

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  // We call apiClient but expect the full ApiResponse, not just the result.
  const response = await apiClient<LoginResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response;
}
