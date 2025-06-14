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
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import axios from 'axios';
import { toast } from 'react-toastify';

const AppointmentForm = ({ onAppointmentBooked }) => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDateTime, setSelectedDateTime] = useState(new Date());
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    // Fetch available doctors
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/doctors');
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
    
    if (!selectedDoctor || !selectedDateTime || !name || !phone) {
      toast.warning('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8080/api/appointments', {
        doctorId: selectedDoctor,
        dateTime: selectedDateTime,
        patientName: name,
        patientPhone: phone,
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
            label="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={selectedDateTime}
              onChange={setSelectedDateTime}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  margin="normal"
                  required
                />
              )}
            />
          </LocalizationProvider>

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