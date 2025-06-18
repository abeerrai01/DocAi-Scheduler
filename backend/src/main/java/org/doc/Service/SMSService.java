package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;

@Service
public class SMSService {

    private static final Logger log = LoggerFactory.getLogger(SMSService.class);

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        log.info("=== SMS SERVICE INIT ===");
        log.info("Initializing Twilio with Account SID: {}", 
            accountSid != null ? accountSid.substring(0, Math.min(10, accountSid.length())) + "..." : "NULL");
        log.info("Auth Token: {}", 
            authToken != null ? authToken.substring(0, Math.min(10, authToken.length())) + "..." : "NULL");
        log.info("Twilio Phone Number: {}", twilioPhoneNumber);
        
        if (accountSid != null && authToken != null) {
            Twilio.init(accountSid, authToken);
            log.info("✅ Twilio initialized successfully");
        } else {
            log.error("❌ Twilio credentials are null - SMS will fail");
        }
        log.info("=== SMS SERVICE INIT COMPLETED ===");
    }

    public void sendAppointmentSummary(String phone, AppointmentDTO dto) {
        log.info("=== SMS SERVICE DEBUG ===");
        log.info("Attempting to send SMS to: {}", phone);
        log.info("Appointment DTO: {}", dto);
        
        try {
            String message = "📅 Appointment booked!\n"
                    + "Doctor: " + dto.getDoctorId() + "\n"
                    + "Date: " + dto.getDate() + " at " + dto.getTime() + "\n"
                    + "Reason: " + dto.getReason();

            log.info("SMS message prepared: {}", message);
            log.info("Sending to phone: +91{}", phone);
            log.info("From Twilio number: {}", twilioPhoneNumber);

            Message.creator(
                    new PhoneNumber("+91" + phone), // customize country code if needed
                    new PhoneNumber(twilioPhoneNumber),
                    message
            ).create();
            
            log.info("✅ SMS sent successfully!");
        } catch (Exception e) {
            log.error("❌ SMS sending failed: {}", e.getMessage(), e);
            throw e;
        }
        log.info("=== SMS SERVICE COMPLETED ===");
    }
}
