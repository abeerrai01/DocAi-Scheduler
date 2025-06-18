package org.doc.Controller;

import org.doc.dto.AppointmentDTO;
import org.doc.Service.AppointmentService;
import org.doc.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://doc-ai-scheduler.vercel.app",
        "https://doc-ai-ml.onrender.com",
        "https://docai-scheduler-production.up.railway.app",
        "https://doc-ai-frontend-backend.vercel.app/"
    },
    allowCredentials = "true"
)
@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    private static final Logger log = LoggerFactory.getLogger(AppointmentController.class);

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentDTO dto) {
        try {
            log.info("=== APPOINTMENT CONTROLLER DEBUG ===");
            log.info("Received appointment request: {}", dto);
            log.info("Doctor ID: {}", dto.doctorId);
            log.info("Date: {}", dto.date);
            log.info("Time: {}", dto.time);
            log.info("Reason: {}", dto.reason);
            log.info("Contact: {}", dto.contact);
            log.info("=====================================");
            
            appointmentService.bookAppointment(dto);
            log.info("Appointment service completed successfully");
            
            log.info("✅ Booking flow finished for contact: {}", dto.getContact());
            
            return ResponseEntity.ok("Appointment booked and slip sent!");
        } catch (Exception e) {
            log.error("=== APPOINTMENT CONTROLLER ERROR ===");
            log.error("Error occurred: {}", e.getMessage(), e);
            log.error("=====================================");
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/test/health")
    public ResponseEntity<String> health() {
        log.info("Health check endpoint called");
        return ResponseEntity.ok("✅ Backend running on Railway!");
    }

    @GetMapping("/debug/env")
    public ResponseEntity<?> showEnv() {
        log.info("Environment debug endpoint called");
        Map<String, String> env = new HashMap<>();
        env.put("RAILWAY_ENVIRONMENT", System.getenv("RAILWAY_ENVIRONMENT"));
        env.put("RAILWAY_LOGGING", System.getenv("RAILWAY_LOGGING"));
        env.put("PORT", System.getenv("PORT"));
        env.put("SPRING_DATASOURCE_URL", System.getenv("SPRING_DATASOURCE_URL"));
        env.put("SPRING_MAIL_USERNAME", System.getenv("SPRING_MAIL_USERNAME"));
        env.put("TWILIO_ACCOUNT_SID", System.getenv("TWILIO_ACCOUNT_SID"));
        return ResponseEntity.ok(env);
    }

    @PostMapping("/test")
    public ResponseEntity<?> testAppointment(@RequestBody AppointmentDTO dto) {
        try {
            log.info("Test endpoint called with DTO: {}", dto);
            return ResponseEntity.ok("Test appointment received: " + dto.doctorId + " on " + dto.date);
        } catch (Exception e) {
            log.error("Test endpoint error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAppointments() {
        try {
            log.info("Fetching all appointments");
            List<Map<String, Object>> appointments = appointmentRepository.findAll();
            log.info("Found {} appointments", appointments.size());
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            log.error("Error fetching appointments: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error fetching appointments: " + e.getMessage());
        }
    }

    @GetMapping("/{contact}")
    public ResponseEntity<?> getAppointmentsByContact(@PathVariable String contact) {
        try {
            log.info("Fetching appointments for contact: {}", contact);
            List<Map<String, Object>> appointments = appointmentRepository.findByContact(contact);
            log.info("Found {} appointments for contact {}", appointments.size(), contact);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            log.error("Error fetching appointments for contact {}: {}", contact, e.getMessage(), e);
            return ResponseEntity.status(500).body("Error fetching appointments: " + e.getMessage());
        }
    }
} 