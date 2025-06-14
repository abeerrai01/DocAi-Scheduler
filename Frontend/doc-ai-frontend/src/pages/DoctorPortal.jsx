import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { toast } from 'react-toastify';

const DoctorPortal = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [doctorId, setDoctorId] = useState('');

  useEffect(() => {
    // In a real app, this would come from authentication
    setDoctorId('1'); // Dummy doctor ID
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/appointments/doctor/${doctorId}`
      );
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAvailability = async (appointmentId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/appointments/${appointmentId}`, {
        status,
      });
      toast.success('Appointment status updated');
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment status');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Doctor Portal
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Upcoming Appointments
              </Typography>
              {appointments.length === 0 ? (
                <Typography color="text.secondary">
                  No upcoming appointments
                </Typography>
              ) : (
                appointments.map((appointment) => (
                  <Box
                    key={appointment.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                    }}
                  >
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Typography variant="subtitle1">
                          Patient: {appointment.patientName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Phone: {appointment.patientPhone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          Date: {new Date(appointment.dateTime).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Time: {new Date(appointment.dateTime).toLocaleTimeString()}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() =>
                              handleUpdateAvailability(appointment.id, 'CONFIRMED')
                            }
                          >
                            Confirm
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() =>
                              handleUpdateAvailability(appointment.id, 'CANCELLED')
                            }
                          >
                            Cancel
                          </Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DoctorPortal; 