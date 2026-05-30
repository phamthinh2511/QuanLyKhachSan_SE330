import { getToken, clearAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  const url = new URL(`${API_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  }

  const token = getToken();

  try {
    const response = await fetch(url.toString(), {
      ...fetchOptions,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...fetchOptions.headers,
      },
    });

    if (response.status === 401) {
      clearAuth();
      window.location.href = "/login";
      throw new Error("Phiên đăng nhập hết hạn");
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? `Lỗi ${response.status}`);
    }

    // DELETE trả về 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.name === "TypeError" ||
        error.message.includes("fetch") ||
        error.message.includes("Load failed")
      ) {
        throw new Error("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc database!");
      }
      throw error;
    }
    throw new Error("Đã xảy ra lỗi không xác định!");
  }
}