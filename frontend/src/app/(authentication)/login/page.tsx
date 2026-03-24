"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hotel, Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: form.username,
          password: form.password
        })
      });

      const data = await response.json();

      if (data.code === 200) {
        localStorage.setItem('token', data.result);
        console.log(data.message);
        router.push("/dashboard");
      } else {
        console.log(data.message);
        setErrorMsg(data.message);
      }
    } catch (error) {
      console.log("Lỗi kết nối server");
      setErrorMsg("Không thể kết nối đến server.");
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
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
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
                  className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-blue-200 cursor-pointer">
                <input type="checkbox" className="rounded border-white/20 bg-white/10 text-blue-500" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-blue-300 hover:text-white transition">
                Quên mật khẩu?
              </a>
            </div>

            {errorMsg && (
                <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
                  {errorMsg}
                </div>
            )}
            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}