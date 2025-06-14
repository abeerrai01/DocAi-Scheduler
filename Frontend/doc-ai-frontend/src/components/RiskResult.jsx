import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';

const MotionCard = motion(Card);

const RiskResult = ({ riskLevel, onBookAppointment }) => {
  const isHighRisk = riskLevel === 'HIGH';

  const recommendations = isHighRisk
    ? [
        'Schedule an appointment with a doctor immediately',
        'Monitor your symptoms closely',
        'Stay hydrated and rest',
        'Avoid contact with others',
      ]
    : [
        'Continue monitoring your symptoms',
        'Get plenty of rest',
        'Stay hydrated',
        'Consider over-the-counter medications for symptom relief',
      ];

  return (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <CardContent>
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          color={isHighRisk ? 'error' : 'success'}
        >
          Risk Assessment: {riskLevel} RISK
        </Typography>

        <Typography variant="body1" paragraph>
          {isHighRisk
            ? 'Based on your symptoms, we recommend scheduling an appointment with a doctor.'
            : 'Your symptoms indicate a low risk level. Continue monitoring your condition.'}
        </Typography>

        <List>
          {recommendations.map((recommendation, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText primary={recommendation} />
              </ListItem>
              {index < recommendations.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>

        {isHighRisk && (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={onBookAppointment}
            >
              Book Appointment
            </Button>
          </Box>
        )}
      </CardContent>
    </MotionCard>
  );
};

export default RiskResult; 