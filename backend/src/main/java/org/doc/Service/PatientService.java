package org.doc.Service;

import org.doc.Entity.Patient;
import org.doc.Repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {

    @Autowired
    private PatientRepository repository;

    public void savePatient(Patient patient) {
        repository.save(patient);
    }

    public String fetchSymptoms(String name) {
        return repository.getSymptomsByName(name);
    }
}