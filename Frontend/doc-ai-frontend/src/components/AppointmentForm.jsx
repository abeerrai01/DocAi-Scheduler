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
import apiSpring from '../config/apiSpring';
import { toast } from 'react-toastify';
import axios from 'axios';

const AppointmentForm = ({ onAppointmentBooked }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [contact, setContact] = useState('');
  const [symptoms, setSymptoms] = useState('');

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const response = await apiSpring.get('/doctors');
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
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason || !contact) {
      toast.warning('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const appointmentData = {
        doctorId: selectedDoctor,
        date: selectedDate,
        time: selectedTime,
        reason: reason,
        contact: contact
      };

      console.log('📨 Sending appointment data to backend:', appointmentData);

      // Use absolute URL to ensure it hits the Railway backend
      const response = await axios.post('https://docai-scheduler-production.up.railway.app/appointments', appointmentData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
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

          <TextField
            fullWidth
            type="date"
            label="Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            margin="normal"
            required
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
          />

          <TextField
            fullWidth
            select
            label="Time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            margin="normal"
            required
          >
            <MenuItem value="09:00">9:00 AM</MenuItem>
            <MenuItem value="10:00">10:00 AM</MenuItem>
            <MenuItem value="11:00">11:00 AM</MenuItem>
            <MenuItem value="14:00">2:00 PM</MenuItem>
            <MenuItem value="15:00">3:00 PM</MenuItem>
            <MenuItem value="16:00">4:00 PM</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Reason for Visit"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            margin="normal"
            required
            placeholder="Brief description of your visit"
          />

          <TextField
            fullWidth
            label="Email or Phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            margin="normal"
            required
            placeholder="Enter email or phone number"
          />

          <TextField
            fullWidth
            label="Symptoms (Optional)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            placeholder="Describe any symptoms you're experiencing"
          />

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