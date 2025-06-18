package org.doc.Controller;

import org.doc.dto.AppointmentDTO;
import org.doc.Service.AppointmentService;
import org.doc.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

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

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<?> bookAppointment(@RequestBody AppointmentDTO dto) {
        try {
            appointmentService.bookAppointment(dto);
            return ResponseEntity.ok("Appointment booked and slip sent!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/test")
    public ResponseEntity<?> testAppointment(@RequestBody AppointmentDTO dto) {
        try {
            // Test endpoint without email/SMS
            return ResponseEntity.ok("Test appointment received: " + dto.doctorId + " on " + dto.date);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<?> getAppointments() {
        try {
            List<Map<String, Object>> appointments = appointmentRepository.findAll();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching appointments: " + e.getMessage());
        }
    }

    @GetMapping("/{contact}")
    public ResponseEntity<?> getAppointmentsByContact(@PathVariable String contact) {
        try {
            List<Map<String, Object>> appointments = appointmentRepository.findByContact(contact);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching appointments: " + e.getMessage());
        }
    }
} 