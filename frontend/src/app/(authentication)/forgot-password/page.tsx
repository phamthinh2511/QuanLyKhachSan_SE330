"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Hotel,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  KeyRound,
  Send,
} from "lucide-react";
import {
  forgotPasswordApi,
  verifyOtpApi,
  resetPasswordApi,
} from "@/lib/api/auth";

const STEPS = [
  { label: "Nhập Email", icon: Mail },
  { label: "Xác minh OTP", icon: ShieldCheck },
  { label: "Đổi mật khẩu", icon: KeyRound },
];

const OTP_EXPIRY_SECONDS = 300; // 5 minutes
const MAX_RESEND = 3;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Email
  const [email, setEmail] = useState("");

  // Step 2: OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(OTP_EXPIRY_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3: Password
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Countdown timer for OTP
  useEffect(() => {
    if (step !== 2) return;
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // Step 1: Send OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPasswordApi(email);
      setStep(2);
      setCountdown(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      setSuccess("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gửi OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = useCallback(async (otpCode: string) => {
    setLoading(true);
    setError("");
    try {
      await verifyOtpApi(email, otpCode);
      setStep(3);
      setSuccess("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Xác minh OTP thất bại");
      // Clear OTP inputs on error
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }, [email]);

  // Step 2: Resend OTP
  const handleResendOtp = async () => {
    if (resendCount >= MAX_RESEND) {
      setError(`Đã vượt quá số lần gửi lại OTP (${MAX_RESEND} lần).`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await forgotPasswordApi(email);
      setResendCount((prev) => prev + 1);
      setCountdown(OTP_EXPIRY_SECONDS);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      setSuccess(`Mã OTP mới đã được gửi (${resendCount + 1}/${MAX_RESEND})`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gửi lại OTP thất bại");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPasswordApi(email, otp.join(""), newPassword, confirmPassword);
      setSuccess("Đổi mật khẩu thành công! Đang chuyển về trang đăng nhập...");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  // OTP Input handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullOtp = newOtp.join("");
      if (fullOtp.length === 6) {
        handleVerifyOtp(fullOtp);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 0) return;
    const newOtp = [...otp];
    for (let i = 0; i < paste.length && i < 6; i++) {
      newOtp[i] = paste[i];
    }
    setOtp(newOtp);
    if (paste.length === 6) {
      handleVerifyOtp(paste);
    } else {
      otpRefs.current[Math.min(paste.length, 5)]?.focus();
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
          {/* Back button */}
          <button
            onClick={() => {
              if (step === 1) {
                router.push("/login");
              } else {
                setStep(step - 1);
                setError("");
                setSuccess("");
              }
            }}
            className="flex items-center gap-1.5 text-blue-300 hover:text-white text-sm mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            {step === 1 ? "Quay lại đăng nhập" : "Quay lại"}
          </button>

          {/* Progress Steps */}
          <div className="flex items-start mb-8">
            {STEPS.map((s, i) => {
              const StepIcon = s.icon;
              const stepNum = i + 1;
              const isActive = step === stepNum;
              const isCompleted = step > stepNum;
              return (
                <div key={i} className="contents">
                  <div className="flex flex-col items-center" style={{ width: 80 }}>
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                          : isActive
                          ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110"
                          : "bg-white/10 text-blue-300/50"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <StepIcon className="w-5 h-5" />
                      )}
                    </div>
                    <span
                      className={`text-xs mt-2 text-center whitespace-nowrap transition-colors ${
                        isActive
                          ? "text-white font-medium"
                          : isCompleted
                          ? "text-green-300"
                          : "text-blue-300/50"
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mt-5 transition-colors duration-300 ${
                        step > stepNum ? "bg-green-500" : "bg-white/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 text-red-200 text-sm px-4 py-3 rounded-xl mb-5 animate-[fadeIn_0.2s_ease-out]">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 bg-green-500/20 border border-green-400/30 text-green-200 text-sm px-4 py-3 rounded-xl mb-5 animate-[fadeIn_0.2s_ease-out]">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              {success}
            </div>
          )}

          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-white text-2xl font-semibold mb-1">
                Quên mật khẩu
              </h2>
              <p className="text-blue-200 text-sm mb-6">
                Nhập email nhân viên để nhận mã OTP đặt lại mật khẩu.
              </p>

              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="text-blue-100 text-sm font-medium mb-1.5 block">
                    Email nhân viên
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="nhanvien@email.com"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Gửi mã OTP
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-white text-2xl font-semibold mb-1">
                Nhập mã OTP
              </h2>
              <p className="text-blue-200 text-sm mb-6">
                Chúng tôi đã gửi mã xác thực 6 chữ số đến{" "}
                <span className="text-white font-medium">{email}</span>
              </p>

              {/* OTP Inputs */}
              <div className="flex gap-2 justify-center mb-6" onPaste={handleOtpPaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 bg-white/10 border border-white/20 text-white text-center text-xl font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 hover:bg-white/15"
                    autoFocus={index === 0}
                    disabled={loading}
                  />
                ))}
              </div>

              {/* Countdown */}
              <div className="text-center mb-6">
                {countdown > 0 ? (
                  <p className="text-blue-200 text-sm">
                    Mã OTP hết hạn sau{" "}
                    <span className="text-white font-semibold font-mono bg-white/10 px-2 py-0.5 rounded">
                      {formatTime(countdown)}
                    </span>
                  </p>
                ) : (
                  <p className="text-amber-300 text-sm">
                    Mã OTP đã hết hạn
                  </p>
                )}
              </div>

              {/* Verify button */}
              <button
                onClick={() => handleVerifyOtp(otp.join(""))}
                disabled={loading || otp.join("").length !== 6}
                className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mb-4"
              >
                {loading ? (
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Xác minh
                  </>
                )}
              </button>

              {/* Resend */}
              <div className="text-center">
                {resendCount >= MAX_RESEND ? (
                  <span className="text-red-300/70 text-sm">
                    Đã hết lượt gửi lại OTP ({MAX_RESEND}/{MAX_RESEND})
                  </span>
                ) : (
                  <>
                    <span className="text-blue-300 text-sm">
                      Không nhận được mã?{" "}
                    </span>
                    <button
                      onClick={handleResendOtp}
                      disabled={!canResend || loading}
                      className={`text-sm font-medium transition-colors ${
                        canResend
                          ? "text-blue-400 hover:text-white cursor-pointer"
                          : "text-blue-300/40 cursor-not-allowed"
                      }`}
                    >
                      Gửi lại ({resendCount}/{MAX_RESEND})
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Reset Password */}
          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-white text-2xl font-semibold mb-1">
                Đặt lại mật khẩu
              </h2>
              <p className="text-blue-200 text-sm mb-6">
                Nhập mật khẩu mới cho tài khoản của bạn.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="text-blue-100 text-sm font-medium mb-1.5 block">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="Nhập mật khẩu mới"
                      required
                      minLength={6}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                    >
                      {showNewPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-blue-100 text-sm font-medium mb-1.5 block">
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-300" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-white/10 border border-white/20 text-white placeholder:text-blue-300 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                      placeholder="Nhập lại mật khẩu mới"
                      required
                      minLength={6}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Password match indicator */}
                  {confirmPassword && (
                    <p
                      className={`text-xs mt-1.5 flex items-center gap-1 ${
                        newPassword === confirmPassword
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {newPassword === confirmPassword ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Mật khẩu khớp
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-3 h-3" />
                          Mật khẩu không khớp
                        </>
                      )}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className="w-full bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      Đổi mật khẩu
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
