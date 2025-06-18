package org.doc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AppointmentDTO {
    @JsonProperty("doctorId")
    private String doctorId;

    @JsonProperty("date")
    private String date;

    @JsonProperty("time")
    private String time;

    @JsonProperty("reason")
    private String reason;

    @JsonProperty("contact")
    private String contact;

    // Debug constructor
    public AppointmentDTO() {
        System.out.println("✅ AppointmentDTO constructor called");
    }

    // Debug toString
    @Override
    public String toString() {
        return String.format("AppointmentDTO(doctorId='%s', date='%s', time='%s', reason='%s', contact='%s')",
            doctorId, date, time, reason, contact);
    }
} 