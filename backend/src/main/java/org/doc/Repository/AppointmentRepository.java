package org.doc.Repository;

import org.doc.Entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Map;

@Repository
public class AppointmentRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Appointment appointment) {
        String sql = "INSERT INTO appointments(doctor_id, date, time, reason, contact, status) VALUES (?, ?, ?, ?, ?, ?)";
        return jdbcTemplate.update(sql, 
            appointment.getDoctorId(), 
            appointment.getDate(), 
            appointment.getTime(), 
            appointment.getReason(), 
            appointment.getContact(),
            appointment.getStatus()
        );
    }

    public List<Map<String, Object>> findByContact(String contact) {
        String sql = "SELECT * FROM appointments WHERE contact = ?";
        return jdbcTemplate.queryForList(sql, contact);
    }

    public List<Map<String, Object>> findByDoctorId(String doctorId) {
        String sql = "SELECT * FROM appointments WHERE doctor_id = ?";
        return jdbcTemplate.queryForList(sql, doctorId);
    }

    public List<Map<String, Object>> findAll() {
        String sql = "SELECT * FROM appointments ORDER BY created_at DESC";
        return jdbcTemplate.queryForList(sql);
    }
} 