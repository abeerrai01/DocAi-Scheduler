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
        Twilio.init(accountSid, authToken);
    }

    public void sendAppointmentSummary(String phone, AppointmentDTO dto) {
        String message = "📅 Appointment booked!\n"
                + "Doctor: " + dto.getDoctorId() + "\n"
                + "Date: " + dto.getDate() + " at " + dto.getTime() + "\n"
                + "Reason: " + dto.getReason();

        Message.creator(
                new PhoneNumber("+91" + phone), // customize country code if needed
                new PhoneNumber(twilioPhoneNumber),
                message
        ).create();
    }
}
