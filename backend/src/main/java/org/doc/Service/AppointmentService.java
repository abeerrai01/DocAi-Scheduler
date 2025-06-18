package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.doc.Entity.Appointment;
import org.doc.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.io.File;

@Service
public class AppointmentService {

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
        System.out.println("=== APPOINTMENT SERVICE DEBUG ===");
        System.out.println("Starting appointment booking process...");
        System.out.println("DTO received: " + dto);
        
        // Convert DTO to Entity
        Appointment appointment = new Appointment();
        appointment.setDoctorId(dto.doctorId);
        appointment.setDate(LocalDate.parse(dto.date));
        appointment.setTime(LocalTime.parse(dto.time));
        appointment.setReason(dto.reason);
        appointment.setContact(dto.contact);
        
        System.out.println("Appointment entity created: " + appointment);
        
        // Save to database
        System.out.println("Attempting to save to database...");
        int result = appointmentRepository.save(appointment);
        System.out.println("Database save result: " + result + " rows affected");
        
        if (result > 0) {
            System.out.println("✅ Database save successful!");
        } else {
            System.out.println("❌ Database save failed - no rows affected");
            throw new Exception("Failed to save appointment to database");
        }

        // Generate PDF
        System.out.println("Generating PDF...");
        File pdf = pdfGenerator.createPDF(dto);
        System.out.println("PDF generated: " + pdf.getAbsolutePath());
        System.out.println("PDF exists: " + pdf.exists());
        System.out.println("PDF size: " + pdf.length() + " bytes");

        // Send notification based on contact type
        if (dto.contact.contains("@")) {
            System.out.println("Contact contains @ - sending email to: " + dto.contact);
            try {
                emailService.sendAppointmentSlip(dto.contact, pdf);
                System.out.println("✅ Email sent successfully to: " + dto.contact);
            } catch (Exception e) {
                System.out.println("❌ Email sending failed: " + e.getMessage());
                e.printStackTrace();
                // Don't throw here - we still want to save the appointment
            }
        } else {
            System.out.println("Contact is phone number - sending SMS to: " + dto.contact);
            try {
                smsService.sendAppointmentSummary(dto.contact, dto);
                System.out.println("✅ SMS sent successfully to: " + dto.contact);
            } catch (Exception e) {
                System.out.println("❌ SMS sending failed: " + e.getMessage());
                e.printStackTrace();
                // Don't throw here - we still want to save the appointment
            }
        }
        
        System.out.println("=== APPOINTMENT SERVICE COMPLETED ===");
    }
} 