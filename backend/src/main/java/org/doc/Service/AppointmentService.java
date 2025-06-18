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
        // Convert DTO to Entity
        Appointment appointment = new Appointment();
        appointment.setDoctorId(dto.doctorId);
        appointment.setDate(LocalDate.parse(dto.date));
        appointment.setTime(LocalTime.parse(dto.time));
        appointment.setReason(dto.reason);
        appointment.setContact(dto.contact);
        
        // Save to database
        appointmentRepository.save(appointment);

        // Generate PDF
        File pdf = pdfGenerator.createPDF(dto);

        // Send notification based on contact type
        if (dto.contact.contains("@")) {
            emailService.sendAppointmentSlip(dto.contact, pdf);
        } else {
            smsService.sendAppointmentSummary(dto.contact, dto);
        }
    }
} 