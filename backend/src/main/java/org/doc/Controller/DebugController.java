package org.doc.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {

    private static final Logger log = LoggerFactory.getLogger(DebugController.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @GetMapping("/check")
    public ResponseEntity<String> testAll() {
        log.info("=== DEBUG CHECK ENDPOINT CALLED ===");
        
        try {
            // Test database connection
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            log.info("✅ Database connection successful: {}", result);
            return ResponseEntity.ok("✅ DB Connected - Result: " + result);
        } catch (Exception e) {
            log.error("❌ Database connection failed: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body("❌ DB Fail: " + e.getMessage());
        }
    }

    @GetMapping("/env")
    public ResponseEntity<?> showEnvironment() {
        log.info("=== ENVIRONMENT DEBUG ENDPOINT CALLED ===");
        
        Map<String, String> env = new HashMap<>();
        env.put("RAILWAY_ENVIRONMENT", System.getenv("RAILWAY_ENVIRONMENT"));
        env.put("RAILWAY_LOGGING", System.getenv("RAILWAY_LOGGING"));
        env.put("PORT", System.getenv("PORT"));
        env.put("SPRING_DATASOURCE_URL", System.getenv("SPRING_DATASOURCE_URL"));
        env.put("SPRING_DATASOURCE_USERNAME", System.getenv("SPRING_DATASOURCE_USERNAME"));
        env.put("SPRING_DATASOURCE_PASSWORD", System.getenv("SPRING_DATASOURCE_PASSWORD"));
        env.put("SPRING_MAIL_USERNAME", System.getenv("SPRING_MAIL_USERNAME"));
        env.put("SPRING_MAIL_PASSWORD", System.getenv("SPRING_MAIL_PASSWORD"));
        env.put("TWILIO_ACCOUNT_SID", System.getenv("TWILIO_ACCOUNT_SID"));
        env.put("TWILIO_AUTH_TOKEN", System.getenv("TWILIO_AUTH_TOKEN"));
        env.put("TWILIO_PHONE_NUMBER", System.getenv("TWILIO_PHONE_NUMBER"));
        
        log.info("Environment variables: {}", env);
        return ResponseEntity.ok(env);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        log.info("=== HEALTH CHECK ENDPOINT CALLED ===");
        return ResponseEntity.ok("✅ Backend running on Railway!");
    }

    @GetMapping("/test-db")
    public ResponseEntity<?> testDatabase() {
        log.info("=== DATABASE TEST ENDPOINT CALLED ===");
        
        try {
            // Test if appointments table exists
            jdbcTemplate.queryForObject("SELECT COUNT(*) FROM appointments", Integer.class);
            log.info("✅ Appointments table exists");
            
            // Get appointment count
            Integer count = jdbcTemplate.queryForObject("SELECT COUNT(*) FROM appointments", Integer.class);
            log.info("✅ Appointments count: {}", count);
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", "success");
            result.put("table_exists", true);
            result.put("appointment_count", count);
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("❌ Database test failed: {}", e.getMessage(), e);
            
            Map<String, Object> result = new HashMap<>();
            result.put("status", "error");
            result.put("error", e.getMessage());
            
            return ResponseEntity.status(500).body(result);
        }
    }
} 