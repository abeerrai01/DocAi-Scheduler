package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.element.Paragraph;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private JavaMailSender mailSender;

    // Twilio vars from env
    private final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    private final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
    private final String FROM_PHONE = System.getenv("TWILIO_PHONE_NUMBER");

    @PostConstruct
    public void initTwilio() {
        log.info("=== SMS SERVICE INIT ===");
        log.info("Initializing Twilio with Account SID: {}", ACCOUNT_SID);
        log.info("Auth Token: {}", AUTH_TOKEN != null ? AUTH_TOKEN.substring(0, 4) + "..." : "null");
        log.info("Twilio Phone Number: {}", FROM_PHONE);
        try {
            Twilio.init(ACCOUNT_SID, AUTH_TOKEN);
            log.info("✅ Twilio initialized successfully");
        } catch (Exception e) {
            log.error("❌ Failed to initialize Twilio: {}", e.getMessage());
        }
        log.info("=== SMS SERVICE INIT COMPLETED ===");
    }

    public void bookAppointment(AppointmentDTO dto) throws Exception {
        log.info("🔥 Booking appointment with: {}", dto);

        // 1. Insert into DB
        String sql = "INSERT INTO appointments (doctor_id, date, time, reason, contact) VALUES (?, ?, ?, ?, ?)";
        int rows = jdbc.update(sql, dto.getDoctorId(), dto.getDate(), dto.getTime(), dto.getReason(), dto.getContact());
        log.info("📥 DB Insert complete, rows affected: {}", rows);

        // 2. Generate PDF slip
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdfDoc = new PdfDocument(writer);
        Document document = new Document(pdfDoc);
        document.add(new Paragraph("Appointment Slip"));
        document.add(new Paragraph("Doctor ID: " + dto.getDoctorId()));
        document.add(new Paragraph("Date: " + dto.getDate()));
        document.add(new Paragraph("Time: " + dto.getTime()));
        document.add(new Paragraph("Reason: " + dto.getReason()));
        document.add(new Paragraph("Contact: " + dto.getContact()));
        document.close();
        log.info("📄 PDF generated for appointment");

        // 3. Send email or SMS
        if (dto.getContact().contains("@")) {
            sendEmail(dto.getContact(), out.toByteArray());
        } else {
            sendSMS(dto);
        }

        log.info("✅ Booking process finished");
    }

    private void sendEmail(String to, byte[] pdfBytes) throws Exception {
        log.info("📧 Sending email to: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo(to);
        helper.setSubject("Your Appointment Slip");
        helper.setText("Dear Patient,\n\nPlease find your appointment details attached as PDF.\n\nRegards,\nDocAi Scheduler");

        InputStreamSource attachment = new ByteArrayResource(pdfBytes);
        helper.addAttachment("AppointmentSlip.pdf", attachment);
        mailSender.send(message);
        log.info("✅ Email sent to: {}", to);
    }

    private void sendSMS(AppointmentDTO dto) {
        log.info("📱 Sending SMS to: {}", dto.getContact());
        String text = "Appointment booked with Doctor ID: " + dto.getDoctorId() +
                " on " + dto.getDate() + " at " + dto.getTime() +
                ". Reason: " + dto.getReason();
        Message.creator(
                new com.twilio.type.PhoneNumber(dto.getContact()),
                new com.twilio.type.PhoneNumber(FROM_PHONE),
                text
        ).create();
        log.info("✅ SMS sent to: {}", dto.getContact());
    }
}
