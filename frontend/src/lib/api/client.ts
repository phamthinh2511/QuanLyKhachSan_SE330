import { getToken, clearAuth } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

interface FetchOptions extends RequestInit {
  params?: Record<string, string>;
}

export class ApiError extends Error {
  isApiError = true;
  status: number;
  code: string | number;
  result: any;

  constructor(message: string, status: number, code: string | number, result: any = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.result = result;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
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
      let errorMessage = error.message || `Lỗi ${response.status}`;

      if (response.status === 422 && error.result && typeof error.result === "object") {
        const details = Object.values(error.result)
          .map((reason) => `- ${reason}`)
          .join("\n");
        if (details) {
          errorMessage = `${errorMessage}\n${details}`;
        }
      }

      throw new ApiError(
        errorMessage,
        response.status,
        error.code || response.status,
        error.result || null
      );
    }

    // DELETE trả về 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error: any) {
    if (error && error.isApiError) {
      throw error;
    }
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