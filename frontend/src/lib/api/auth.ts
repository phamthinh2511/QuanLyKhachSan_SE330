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

export interface ApiResponseVoid {
  code: number;
  message: string;
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

export async function forgotPasswordApi(email: string): Promise<ApiResponseVoid> {
  const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(data.message ?? "Gửi OTP thất bại");
  }
  return data;
}

export async function verifyOtpApi(email: string, otp: string): Promise<ApiResponseVoid> {
  const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(data.message ?? "Xác minh OTP thất bại");
  }
  return data;
}

export async function resetPasswordApi(
  email: string,
  otp: string,
  newPassword: string,
  confirmPassword: string
): Promise<ApiResponseVoid> {
  const res = await fetch(`${API_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
  });

  const data = await res.json();
  if (data.code !== 200) {
    throw new Error(data.message ?? "Đổi mật khẩu thất bại");
  }
  return data;
}