import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const symptoms = [
  'Fever',
  'Cough',
  'Shortness of breath',
  'Fatigue',
  'Muscle aches',
  'Headache',
  'Loss of taste or smell',
  'Sore throat',
  'Congestion',
  'Nausea',
];

const SymptomForm = ({ onRiskAssessment }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      toast.warning('Please select at least one symptom');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('https://docai-scheduler-production.up.railway.app/api/predict', {
        symptoms: selectedSymptoms,
      });

      onRiskAssessment(response.data);
      toast.success('Risk assessment completed');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to assess risk. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Select Your Symptoms
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Please check all symptoms that apply to you
        </Typography>

        <FormGroup>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
            {symptoms.map((symptom) => (
              <FormControlLabel
                key={symptom}
                control={
                  <Checkbox
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleSymptomChange(symptom)}
                  />
                }
                label={symptom}
              />
            ))}
          </Box>
        </FormGroup>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Assessing Risk...' : 'Check Risk'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SymptomForm; 