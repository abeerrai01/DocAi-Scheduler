package org.doc.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.File;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendAppointmentSlip(String toEmail, File pdfFile) throws MessagingException {
        log.info("=== EMAIL SERVICE DEBUG ===");
        log.info("Attempting to send email to: {}", toEmail);
        log.info("PDF file: {}", pdfFile.getAbsolutePath());
        log.info("PDF exists: {}", pdfFile.exists());
        log.info("PDF size: {} bytes", pdfFile.length());
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject("Your Appointment Slip");
            helper.setText("Hi! Your appointment has been confirmed. Please find the attached slip.");
            helper.addAttachment("AppointmentSlip.pdf", pdfFile);

            log.info("Email message prepared, attempting to send...");
            mailSender.send(message);
            log.info("✅ Email sent successfully!");
        } catch (Exception e) {
            log.error("❌ Email sending failed: {}", e.getMessage(), e);
            throw e;
        }
        log.info("=== EMAIL SERVICE COMPLETED ===");
    }
} 