import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import api from '../config/api';
import { toast } from 'react-toastify';

const AppointmentForm = ({ onAppointmentBooked }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const response = await api.get('/doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
        toast.error('Failed to fetch doctors');
      }
    };

    fetchDoctors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedDoctor) {
      toast.warning('Please select a doctor');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/appointments', {
        doctorId: selectedDoctor,
        appointmentType: 'regular',
        symptoms: symptoms
      });

      toast.success('Appointment booked successfully!');
      onAppointmentBooked(response.data);
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Book an Appointment
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Symptoms"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            select
            label="Select Doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            margin="normal"
            required
          >
            {doctors.map((doctor) => (
              <MenuItem key={doctor.id} value={doctor.id}>
                Dr. {doctor.name} - {doctor.specialization}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm; 