package org.doc.Service;

import org.doc.dto.AppointmentDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;
import jakarta.annotation.PostConstruct;

@Service
public class SMSService {

    @Value("${twilio.account.sid}")
    private String accountSid;

    @Value("${twilio.auth.token}")
    private String authToken;

    @Value("${twilio.phone.number}")
    private String twilioPhoneNumber;

    @PostConstruct
    public void init() {
        System.out.println("=== SMS SERVICE INIT ===");
        System.out.println("Initializing Twilio with Account SID: " + (accountSid != null ? accountSid.substring(0, Math.min(10, accountSid.length())) + "..." : "NULL"));
        System.out.println("Auth Token: " + (authToken != null ? authToken.substring(0, Math.min(10, authToken.length())) + "..." : "NULL"));
        System.out.println("Twilio Phone Number: " + twilioPhoneNumber);
        
        if (accountSid != null && authToken != null) {
            Twilio.init(accountSid, authToken);
            System.out.println("✅ Twilio initialized successfully");
        } else {
            System.out.println("❌ Twilio credentials are null - SMS will fail");
        }
        System.out.println("=== SMS SERVICE INIT COMPLETED ===");
    }

    public void sendAppointmentSummary(String phone, AppointmentDTO dto) {
        System.out.println("=== SMS SERVICE DEBUG ===");
        System.out.println("Attempting to send SMS to: " + phone);
        System.out.println("Appointment DTO: " + dto);
        
        try {
            String message = "📅 Appointment booked!\n"
                    + "Doctor: " + dto.getDoctorId() + "\n"
                    + "Date: " + dto.getDate() + " at " + dto.getTime() + "\n"
                    + "Reason: " + dto.getReason();

            System.out.println("SMS message prepared: " + message);
            System.out.println("Sending to phone: +91" + phone);
            System.out.println("From Twilio number: " + twilioPhoneNumber);

            Message.creator(
                    new PhoneNumber("+91" + phone), // customize country code if needed
                    new PhoneNumber(twilioPhoneNumber),
                    message
            ).create();
            
            System.out.println("✅ SMS sent successfully!");
        } catch (Exception e) {
            System.out.println("❌ SMS sending failed: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
        System.out.println("=== SMS SERVICE COMPLETED ===");
    }
}
