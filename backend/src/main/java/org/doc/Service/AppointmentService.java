package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.doc.Entity.Appointment;
import org.doc.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.io.File;

@Service
public class AppointmentService {

    private static final Logger log = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private JdbcTemplate jdbc;

    @Autowired
    private PDFGenerator pdfGenerator;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SMSService smsService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    public void bookAppointment(AppointmentDTO dto) throws Exception {
        log.info("=== APPOINTMENT SERVICE DEBUG ===");
        log.info("🔥 Starting appointment booking process...");
        log.info("DTO received: {}", dto);
        
        // Check Railway environment
        if (System.getenv("RAILWAY_ENVIRONMENT") != null) {
            log.info("✅ Running on Railway environment");
        }
        if (System.getenv("RAILWAY_LOGGING") != null) {
            log.info("✅ Railway Logging is enabled");
        }
        
        // Convert DTO to Entity
        Appointment appointment = new Appointment();
        appointment.setDoctorId(dto.doctorId);
        appointment.setDate(LocalDate.parse(dto.date));
        appointment.setTime(LocalTime.parse(dto.time));
        appointment.setReason(dto.reason);
        appointment.setContact(dto.contact);
        
        log.info("Appointment entity created: {}", appointment);
        
        // Save to database
        log.info("Attempting to save to database...");
        int result = appointmentRepository.save(appointment);
        log.info("Database save result: {} rows affected", result);
        
        if (result > 0) {
            log.info("✅ Database save successful!");
        } else {
            log.error("❌ Database save failed - no rows affected");
            throw new Exception("Failed to save appointment to database");
        }

        // Generate PDF
        log.info("Generating PDF...");
        File pdf = pdfGenerator.createPDF(dto);
        log.info("PDF generated: {}", pdf.getAbsolutePath());
        log.info("PDF exists: {}", pdf.exists());
        log.info("PDF size: {} bytes", pdf.length());

        // Send notification based on contact type
        if (dto.contact.contains("@")) {
            log.info("Contact contains @ - sending email to: {}", dto.contact);
            try {
                emailService.sendAppointmentSlip(dto.contact, pdf);
                log.info("✅ Email sent successfully to: {}", dto.contact);
            } catch (Exception e) {
                log.error("❌ Email sending failed: {}", e.getMessage(), e);
                // Don't throw here - we still want to save the appointment
            }
        } else {
            log.info("Contact is phone number - sending SMS to: {}", dto.contact);
            try {
                smsService.sendAppointmentSummary(dto.contact, dto);
                log.info("✅ SMS sent successfully to: {}", dto.contact);
            } catch (Exception e) {
                log.error("❌ SMS sending failed: {}", e.getMessage(), e);
                // Don't throw here - we still want to save the appointment
            }
        }
        
        log.info("=== APPOINTMENT SERVICE COMPLETED ===");
    }
} 