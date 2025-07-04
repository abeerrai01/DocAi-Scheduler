package org.doc.Controller;

import org.doc.dto.AppointmentDTO;
import org.doc.Service.AppointmentService;
import org.doc.Repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
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
        log.info("📨 [LIVE] /appointments POST request received at {}", System.currentTimeMillis());
        try {
            log.info("=== APPOINTMENT CONTROLLER DEBUG ===");
            log.info("📨 POST /appointments endpoint hit");
            log.info("Request body received: {}", dto);
            
            // Debug: Check each field individually
            log.info("🔍 DEBUG: doctorId={}, date={}, time={}, reason={}, contact={}",
                dto.getDoctorId(), dto.getDate(), dto.getTime(), dto.getReason(), dto.getContact());
            
            // Check if any fields are null
            if (dto.getDoctorId() == null) log.warn("⚠️ doctorId is NULL!");
            if (dto.getDate() == null) log.warn("⚠️ date is NULL!");
            if (dto.getTime() == null) log.warn("⚠️ time is NULL!");
            if (dto.getReason() == null) log.warn("⚠️ reason is NULL!");
            if (dto.getContact() == null) log.warn("⚠️ contact is NULL!");
            
            log.info("Doctor ID: {}", dto.getDoctorId());
            log.info("Date: {}", dto.getDate());
            log.info("Time: {}", dto.getTime());
            log.info("Reason: {}", dto.getReason());
            log.info("Contact: {}", dto.getContact());
            
            // Check if service is injected
            if (appointmentService == null) {
                log.error("❌ CRITICAL: AppointmentService is NULL!");
                return ResponseEntity.status(500).body("Internal server error: Service not available");
            }
            log.info("✅ AppointmentService is properly injected, calling bookAppointment...");
            
            // Call the service
            appointmentService.bookAppointment(dto);
            
            log.info("✅ Controller finished booking for {}", dto.getContact());
            
            // Return detailed response
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "message", "Appointment booked successfully",
                "doctorId", dto.getDoctorId(),
                "date", dto.getDate(),
                "time", dto.getTime(),
                "contact", dto.getContact()
            ));
        } catch (Exception e) {
            log.error("=== APPOINTMENT CONTROLLER ERROR ===");
            log.error("❌ Error occurred in bookAppointment: {}", e.getMessage(), e);
            log.error("Stack trace:", e);
            log.error("=== APPOINTMENT CONTROLLER ERROR END ===");
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
            return ResponseEntity.ok("Test appointment received: " + dto.getDoctorId() + " on " + dto.getDate());
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

    @GetMapping("/test-logic")
    public ResponseEntity<String> testBooking() {
        try {
            log.info("🧪 TEST LOGIC ENDPOINT CALLED");
            
            AppointmentDTO dto = new AppointmentDTO();
            dto.setDoctorId("doc123");
            dto.setDate("2025-06-21");
            dto.setTime("15:00");
            dto.setReason("Test appointment from Railway");
            dto.setContact("theabeerrai@gmail.com");

            log.info("Created test DTO: {}", dto);
            
            appointmentService.bookAppointment(dto);
            
            log.info("✅ Test booking logic executed successfully!");
            return ResponseEntity.ok("✅ Booking logic executed! Check Railway logs for details.");
        } catch (Exception e) {
            log.error("❌ Test booking logic failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("❌ Test failed: " + e.getMessage());
        }
    }

    @GetMapping("/debug/service")
    public ResponseEntity<String> debugService() {
        try {
            log.info("🔍 DEBUG SERVICE ENDPOINT CALLED");
            
            if (appointmentService == null) {
                log.error("❌ AppointmentService is NULL!");
                return ResponseEntity.status(500).body("❌ AppointmentService is NULL!");
            }
            
            log.info("✅ AppointmentService is properly injected");
            log.info("AppointmentService class: {}", appointmentService.getClass().getName());
            
            return ResponseEntity.ok("✅ AppointmentService is properly injected. Class: " + appointmentService.getClass().getName());
        } catch (Exception e) {
            log.error("❌ Debug service failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("❌ Debug failed: " + e.getMessage());
        }
    }

    @PostMapping("/debug-json")
    public ResponseEntity<?> debugJson(@RequestBody String rawJson) {
        try {
            log.info("=== JSON DEBUG ENDPOINT ===");
            log.info("Raw JSON received: {}", rawJson);
            
            // Try to parse as AppointmentDTO
            try {
                AppointmentDTO dto = new AppointmentDTO();
                log.info("Created new DTO instance: {}", dto);
                
                // Log the raw JSON for debugging
                log.info("Raw JSON length: {}", rawJson.length());
                log.info("Raw JSON content: '{}'", rawJson);
                
                return ResponseEntity.ok(Map.of(
                    "message", "JSON received",
                    "rawJson", rawJson,
                    "jsonLength", rawJson.length(),
                    "dtoCreated", dto != null
                ));
            } catch (Exception e) {
                log.error("Error creating DTO: {}", e.getMessage(), e);
                return ResponseEntity.status(500).body(Map.of(
                    "error", "DTO creation failed",
                    "message", e.getMessage()
                ));
            }
        } catch (Exception e) {
            log.error("Debug JSON endpoint error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/debug-dto")
    public ResponseEntity<?> debugDto(@RequestBody AppointmentDTO dto) {
        try {
            log.info("=== DTO DEBUG ENDPOINT ===");
            log.info("DTO received: {}", dto);
            log.info("Doctor ID: '{}'", dto.getDoctorId());
            log.info("Date: '{}'", dto.getDate());
            log.info("Time: '{}'", dto.getTime());
            log.info("Reason: '{}'", dto.getReason());
            log.info("Contact: '{}'", dto.getContact());
            
            // Check if fields are null
            boolean hasNulls = dto.getDoctorId() == null || dto.getDate() == null || 
                              dto.getTime() == null || dto.getReason() == null || dto.getContact() == null;
            
            return ResponseEntity.ok(Map.of(
                "message", "DTO received",
                "dto", dto.toString(),
                "hasNulls", hasNulls,
                "doctorId", dto.getDoctorId(),
                "date", dto.getDate(),
                "time", dto.getTime(),
                "reason", dto.getReason(),
                "contact", dto.getContact()
            ));
        } catch (Exception e) {
            log.error("Debug DTO endpoint error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        log.info("=== PING ENDPOINT CALLED ===");
        return ResponseEntity.ok("pong");
    }

    @PostMapping("/debug-map")
    public ResponseEntity<?> debugMap(@RequestBody Map<String, Object> body) {
        try {
            log.info("=== MAP DEBUG ENDPOINT ===");
            log.info("Raw JSON as Map: {}", body);
            log.info("Map keys: {}", body.keySet());
            
            // Check each expected field
            log.info("doctorId in map: '{}'", body.get("doctorId"));
            log.info("date in map: '{}'", body.get("date"));
            log.info("time in map: '{}'", body.get("time"));
            log.info("reason in map: '{}'", body.get("reason"));
            log.info("contact in map: '{}'", body.get("contact"));
            
            return ResponseEntity.ok(Map.of(
                "message", "Map received",
                "map", body,
                "keys", body.keySet(),
                "doctorId", body.get("doctorId"),
                "date", body.get("date"),
                "time", body.get("time"),
                "reason", body.get("reason"),
                "contact", body.get("contact")
            ));
        } catch (Exception e) {
            log.error("Debug Map endpoint error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }
} 