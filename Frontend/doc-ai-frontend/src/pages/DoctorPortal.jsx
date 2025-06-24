import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material';
import apiNode from '../config/apiNode';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorPortal = () => {
  const { user, isAuthenticated } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated and is a doctor
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (user.role !== 'doctor') {
      console.log('User is not a doctor, redirecting to home');
      navigate('/');
      return;
    }

    fetchAppointments();
  }, [isAuthenticated, user, navigate]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await apiNode.get('/appointments');
      console.log('Fetched appointments:', response.data);
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      await apiNode.put(`/appointments/${appointmentId}`, {
        status: newStatus
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
                    key={appointment._id}
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
                          Patient: {appointment.patientId?.name || 'Unknown'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Type: {appointment.appointmentType === 'emergency' ? 'Emergency' : 'Regular'}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Typography variant="body2">
                          Date: {new Date(appointment.date).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2">
                          Time: {appointment.time}
                        </Typography>
                        {appointment.symptoms && (
                          <Typography variant="body2" color="text.secondary">
                            Symptoms: {appointment.symptoms}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleUpdateStatus(appointment._id, 'in-progress')}
                          >
                            Start
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleUpdateStatus(appointment._id, 'completed')}
                          >
                            Complete
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleUpdateStatus(appointment._id, 'cancelled')}
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