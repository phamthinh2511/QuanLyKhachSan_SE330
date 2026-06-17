package hotelmanagement.backend.service;

import hotelmanagement.backend.entity.Nhanvien;
import hotelmanagement.backend.entity.Taikhoan;
import hotelmanagement.backend.repository.NhanvienRepository;
import hotelmanagement.backend.repository.TaikhoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordResetService {

    private final NhanvienRepository nhanvienRepository;
    private final TaikhoanRepository taikhoanRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final int OTP_LENGTH = 6;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private static final int MAX_ATTEMPTS = 5;
    private static final int MAX_RESEND = 3;

    private final ConcurrentHashMap<String, OtpData> otpStore = new ConcurrentHashMap<>();
    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Generate OTP and send to employee's email
     */
    public void generateAndSendOtp(String email) {
        // Find employee by email
        Nhanvien nhanvien = nhanvienRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với email: " + email));

        // Check if employee has an account
        if (nhanvien.getTaikhoan() == null) {
            throw new RuntimeException("Nhân viên này chưa có tài khoản trong hệ thống");
        }

        String key = email.toLowerCase();

        // Check resend limit
        OtpData existing = otpStore.get(key);
        int resendCount = 0;
        if (existing != null) {
            resendCount = existing.resendCount + 1;
            if (resendCount > MAX_RESEND) {
                throw new RuntimeException("Đã vượt quá số lần gửi lại OTP (" + MAX_RESEND + " lần). Vui lòng thử lại sau.");
            }
        }

        // Generate 6-digit OTP
        String otp = generateOtp();

        // Store OTP with resend count preserved
        otpStore.put(key, new OtpData(otp, LocalDateTime.now(), 0, false, resendCount));

        // Send email
        emailService.sendOtpEmail(email, otp);

        log.info("OTP generated and sent to: {} (resend #{})", email, resendCount);
    }

    /**
     * Verify OTP code
     */
    public void verifyOtp(String email, String otp) {
        String key = email.toLowerCase();
        OtpData otpData = otpStore.get(key);

        if (otpData == null) {
            throw new RuntimeException("Không tìm thấy mã OTP. Vui lòng yêu cầu gửi lại.");
        }

        // Check expiry
        if (otpData.createdAt.plusMinutes(OTP_EXPIRY_MINUTES).isBefore(LocalDateTime.now())) {
            otpStore.remove(key);
            throw new RuntimeException("Mã OTP đã hết hạn. Vui lòng yêu cầu gửi lại.");
        }

        // Check max attempts
        if (otpData.attempts >= MAX_ATTEMPTS) {
            otpStore.remove(key);
            throw new RuntimeException("Đã vượt quá số lần thử. Vui lòng yêu cầu gửi lại mã OTP.");
        }

        // Verify OTP
        if (!otpData.otp.equals(otp)) {
            otpData.attempts++;
            throw new RuntimeException("Mã OTP không chính xác. Còn " + (MAX_ATTEMPTS - otpData.attempts) + " lần thử.");
        }

        // Mark as verified
        otpData.verified = true;
        log.info("OTP verified for: {}", email);
    }

    /**
     * Reset password after OTP verification
     */
    public void resetPassword(String email, String otp, String newPassword, String confirmPassword) {
        // Validate passwords match
        if (!newPassword.equals(confirmPassword)) {
            throw new RuntimeException("Mật khẩu xác nhận không khớp");
        }

        String key = email.toLowerCase();
        OtpData otpData = otpStore.get(key);

        if (otpData == null) {
            throw new RuntimeException("Phiên đặt lại mật khẩu không hợp lệ. Vui lòng thực hiện lại.");
        }

        // Check if OTP was verified
        if (!otpData.verified) {
            throw new RuntimeException("Mã OTP chưa được xác minh");
        }

        // Double check OTP matches
        if (!otpData.otp.equals(otp)) {
            throw new RuntimeException("Mã OTP không hợp lệ");
        }

        // Check expiry (extra safety)
        if (otpData.createdAt.plusMinutes(OTP_EXPIRY_MINUTES).isBefore(LocalDateTime.now())) {
            otpStore.remove(key);
            throw new RuntimeException("Phiên đặt lại mật khẩu đã hết hạn. Vui lòng thực hiện lại.");
        }

        // Find employee and update password
        Nhanvien nhanvien = nhanvienRepository.findByEmailAndIsDeletedFalse(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy nhân viên với email: " + email));

        Taikhoan taikhoan = nhanvien.getTaikhoan();
        taikhoan.setMatKhau(passwordEncoder.encode(newPassword));
        taikhoanRepository.save(taikhoan);

        // Remove OTP from store
        otpStore.remove(key);

        log.info("Password reset successfully for email: {}", email);
    }

    /**
     * Generate random 6-digit OTP
     */
    private String generateOtp() {
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Clean up expired OTPs every 10 minutes
     */
    @Scheduled(fixedRate = 600000)
    public void cleanupExpiredOtps() {
        LocalDateTime now = LocalDateTime.now();
        otpStore.entrySet().removeIf(entry ->
                entry.getValue().createdAt.plusMinutes(OTP_EXPIRY_MINUTES + 5).isBefore(now)
        );
    }

    /**
     * Inner class to store OTP data
     */
    private static class OtpData {
        String otp;
        LocalDateTime createdAt;
        int attempts;
        boolean verified;
        int resendCount;

        OtpData(String otp, LocalDateTime createdAt, int attempts, boolean verified, int resendCount) {
            this.otp = otp;
            this.createdAt = createdAt;
            this.attempts = attempts;
            this.verified = verified;
            this.resendCount = resendCount;
        }
    }
}
