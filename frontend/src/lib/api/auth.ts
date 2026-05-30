const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  result: string; // JWT token
}

export async function loginApi(payload: LoginPayload): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message ?? "Đăng nhập thất bại");
  }

  return res.json();
}