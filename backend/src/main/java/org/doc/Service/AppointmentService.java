package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.doc.Entity.Appointment;
import org.doc.Repository.AppointmentRepository;
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
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.io.ByteArrayOutputStream;
import java.io.File;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private PDFGenerator pdfGenerator;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SMSService smsService;

    // Twilio vars from env
    private final String ACCOUNT_SID = System.getenv("TWILIO_ACCOUNT_SID");
    private final String AUTH_TOKEN = System.getenv("TWILIO_AUTH_TOKEN");
    private final String FROM_PHONE = System.getenv("TWILIO_PHONE_NUMBER");

    public void bookAppointment(AppointmentDTO dto) {
        log.info("🔥 Booking appointment with: {}", dto);
        
        // Convert DTO to Entity
        log.info("🚧 Creating appointment entity...");
        Appointment appointment = new Appointment();
        appointment.setDoctorId(dto.getDoctorId());
        appointment.setDate(LocalDate.parse(dto.getDate()));
        appointment.setTime(LocalTime.parse(dto.getTime()));
        appointment.setReason(dto.getReason());
        appointment.setContact(dto.getContact());
        
        log.info("Appointment entity created: {}", appointment);

        // 1. Insert into DB using both JdbcTemplate and Repository
        log.info("🚧 About to insert into DB...");
        
        // Method 1: JdbcTemplate
        String sql = "INSERT INTO appointments (doctor_id, date, time, reason, contact) VALUES (?, ?, ?, ?, ?)";
        int rows = jdbc.update(sql, dto.getDoctorId(), dto.getDate(), dto.getTime(), dto.getReason(), dto.getContact());
        log.info("📥 JdbcTemplate DB Insert complete, rows affected: {}", rows);
        
        // Method 2: JPA Repository (backup)
        try {
            log.info("🚧 Also trying JPA Repository save...");
            int repoResult = appointmentRepository.save(appointment);
            log.info("📥 JPA Repository save result: {} rows affected", repoResult);
        } catch (Exception e) {
            log.warn("⚠️ JPA Repository save failed: {}", e.getMessage());
        }

        // 2. Generate PDF
        log.info("📄 Generating PDF...");
        File pdf = null;
        try {
            pdf = pdfGenerator.createPDF(dto);
            log.info("📄 PDF generated successfully: {}", pdf.getAbsolutePath());
        } catch (Exception e) {
            log.error("❌ PDF generation failed: {}", e.getMessage(), e);
        }

        // 3. Send Email/SMS
        log.info("📧 Sending email...");
        try {
            if (dto.getContact().contains("@")) {
                if (pdf != null) {
                    emailService.sendAppointmentSlip(dto.getContact(), pdf);
                    log.info("📧 Email sent successfully to: {}", dto.getContact());
                } else {
                    log.warn("⚠️ Cannot send email - PDF was not generated");
                }
            } else {
                smsService.sendAppointmentSummary(dto.getContact(), dto);
                log.info("📱 SMS sent successfully to: {}", dto.getContact());
            }
        } catch (Exception e) {
            log.error("❌ Email/SMS sending failed: {}", e.getMessage(), e);
        }

        log.info("✅ Booking process finished successfully!");
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
