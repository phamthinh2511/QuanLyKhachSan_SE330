"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Eye, EyeOff, Lock, User, AlertCircle } from "lucide-react";
import { loginApi } from "@/lib/api/auth";
import { saveAuth, decodeJwt } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true") {
      saveAuth("dev-token", { name: "Admin User", role: "ADMIN", employeeId: 1 });
      router.push("/dashboard");
      return;
    }

    try {
      const res = await loginApi(form);

      if (res.code !== 200) {
        throw new Error(res.message ?? "Đăng nhập thất bại");
      }

      // Giải mã JWT và lưu thông tin đăng nhập thực tế
      const decoded = decodeJwt(res.result);
      const role = decoded?.role || "NHAN_VIEN";
      const name = decoded?.sub || "User";
      const employeeId = decoded?.maNhanVien || null;

      saveAuth(res.result, { name, role, employeeId });
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="bg-blue-500 p-2.5 rounded-xl">
            <Hotel className="w-7 h-7 text-white" />
          </div>
          <span className="text-white text-2xl font-bold tracking-tight">
            Hotel Manager
          </span>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-white text-2xl font-semibold mb-1">Đăng nhập</h2>
          <p className="text-blue-200 text-sm mb-8">
            Chào mừng trở lại! Vui lòng đăng nhập.
          </p>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="text-blue-100 text-sm font-medium mb-1.5 block">
                Tên đăng nhập
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-blue-100 text-sm font-medium mb-1.5 block">
                Mật khẩu
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye className="w-4 h-4" />
                  }
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading
                ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : "Đăng nhập"
              }
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}