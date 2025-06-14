import React, { useState } from 'react';
import { Container, Box, Typography } from '@mui/material';
import SymptomForm from '../components/SymptomForm';
import RiskResult from '../components/RiskResult';
import AppointmentForm from '../components/AppointmentForm';

const PatientPortal = () => {
  const [riskLevel, setRiskLevel] = useState(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentBooked, setAppointmentBooked] = useState(false);

  const handleRiskAssessment = (result) => {
    setRiskLevel(result.riskLevel);
  };

  const handleBookAppointment = () => {
    setShowAppointmentForm(true);
  };

  const handleAppointmentBooked = (appointment) => {
    setAppointmentBooked(true);
    setShowAppointmentForm(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Patient Portal
      </Typography>

      {!riskLevel && !showAppointmentForm && !appointmentBooked && (
        <SymptomForm onRiskAssessment={handleRiskAssessment} />
      )}

      {riskLevel && !showAppointmentForm && !appointmentBooked && (
        <RiskResult
          riskLevel={riskLevel}
          onBookAppointment={handleBookAppointment}
        />
      )}

      {showAppointmentForm && (
        <AppointmentForm onAppointmentBooked={handleAppointmentBooked} />
      )}

      {appointmentBooked && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h5" gutterBottom color="success.main">
            Appointment Booked Successfully!
          </Typography>
          <Typography variant="body1">
            You will receive a confirmation shortly.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default PatientPortal; 