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
} 