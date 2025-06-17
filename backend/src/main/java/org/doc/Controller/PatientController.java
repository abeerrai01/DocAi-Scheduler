package org.doc.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.doc.Entity.Patient;
import org.doc.Service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@CrossOrigin(
    origins = {
        "http://localhost:5173",
        "https://doc-ai-scheduler.vercel.app",
        "https://doc-ai-ml.onrender.com",
        "https://docai-scheduler-production.up.railway.app",
        "https://doc-ai-frontend-backend.vercel.app/"

    },
    allowCredentials = "true"
)
@RestController
@RequestMapping("/api/patient")
public class PatientController {

    @Autowired
    private PatientService service;
    RestTemplate restTemplate = new RestTemplate();
    @PostMapping("/submit-all")
    public ResponseEntity<?> handleAllAtOnce(@RequestBody Patient patient) {
        try {
            // 1. Save patient
            service.savePatient(patient);

            // 2. Fetch symptoms by name
            String symptomsString = service.fetchSymptoms(patient.getName());
            if (symptomsString == null || symptomsString.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No symptoms found for patient.");
            }

            // 3. Prepare payload for ML
            String[] symptomArray = symptomsString.split(",");
            Map<String, Object> mlPayload = new HashMap<>();
            mlPayload.put("symptoms", Arrays.asList(symptomArray));

            // 4. Setup headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(mlPayload, headers);

            // 5. Call ML API
            String mlUrl = "https://doc-ai-ml.onrender.com/predict";
            ResponseEntity<String> mlResponse = restTemplate.postForEntity(mlUrl, entity, String.class);

            // 6. Return result
            Map<String, Object> response = new HashMap<>();
            response.put("message", "✅ Patient saved and prediction done");
            ObjectMapper mapper = new ObjectMapper();
            Map<String, Object> parsedML = mapper.readValue(mlResponse.getBody(), Map.class);
            response.put("ml_output", parsedML);


            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Something went wrong: " + e.getMessage());
        }
    }

}
