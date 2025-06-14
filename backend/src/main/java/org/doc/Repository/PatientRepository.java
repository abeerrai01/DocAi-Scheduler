package org.doc.Repository;

import org.doc.Entity.Patient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PatientRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public int save(Patient patient) {
        String sql = "INSERT INTO patients(name, age, symptoms, pincode) VALUES (?, ?, ?, ?)";
        return jdbcTemplate.update(sql, patient.getName(), patient.getAge(), patient.getSymptoms(), patient.getPincode());
    }

    public String getSymptomsByName(String name) {
        String sql = "SELECT symptoms FROM patients WHERE name = ?";
        return jdbcTemplate.queryForObject(sql, new Object[]{name}, String.class);
    }
}