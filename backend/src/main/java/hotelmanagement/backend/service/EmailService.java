package hotelmanagement.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Async
    public void sendOtpEmail(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject("🔐 Mã OTP đặt lại mật khẩu - Hotel Manager");
            helper.setText(buildOtpEmailHtml(otp), true);

            mailSender.send(message);
            log.info("OTP email sent successfully to: {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send OTP email to: {}", to, e);
            throw new RuntimeException("Không thể gửi email OTP. Vui lòng thử lại sau.");
        }
    }

    private String buildOtpEmailHtml(String otp) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                </head>
                <body style="margin:0;padding:0;font-family:'Segoe UI',Arial,sans-serif;background-color:#f0f4f8;">
                    <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                        <!-- Header -->
                        <div style="background:linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%);padding:32px 24px;text-align:center;">
                            <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:600;">🏨 Hotel Manager</h1>
                            <p style="color:#93c5fd;margin:8px 0 0;font-size:14px;">Đặt lại mật khẩu</p>
                        </div>
                        <!-- Body -->
                        <div style="padding:32px 24px;">
                            <p style="color:#374151;font-size:15px;line-height:1.6;margin:0 0 24px;">
                                Xin chào,<br><br>
                                Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.
                                Vui lòng sử dụng mã OTP bên dưới để tiếp tục:
                            </p>
                            <!-- OTP Box -->
                            <div style="background:#f0f7ff;border:2px dashed #2563eb;border-radius:12px;padding:24px;text-align:center;margin:0 0 24px;">
                                <p style="color:#6b7280;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1px;">Mã xác thực OTP</p>
                                <p style="color:#1e3a5f;font-size:36px;font-weight:700;letter-spacing:8px;margin:0;">%s</p>
                            </div>
                            <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0 0 8px;">
                                ⏱ Mã OTP có hiệu lực trong <strong>5 phút</strong>.
                            </p>
                            <p style="color:#6b7280;font-size:13px;line-height:1.5;margin:0;">
                                ⚠️ Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                            </p>
                        </div>
                        <!-- Footer -->
                        <div style="background:#f9fafb;padding:16px 24px;text-align:center;border-top:1px solid #e5e7eb;">
                            <p style="color:#9ca3af;font-size:12px;margin:0;">© 2026 Hotel Manager. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                """.replace("%s", otp);
    }
}
