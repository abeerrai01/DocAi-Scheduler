package org.doc.dto;

import lombok.Data;

@Data
public class AppointmentDTO {
    public String doctorId;
    public String date;
    public String time;
    public String reason;
    public String contact;
} 