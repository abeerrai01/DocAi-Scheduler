const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Middleware
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, age, role } = req.body;
    console.log('Registration attempt:', { username, name, age, role });

    // Validate required fields
    if (!username || !password || !name || !age || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (!['patient', 'doctor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Validate age
    if (isNaN(age) || age < 0 || age > 120) {
      return res.status(400).json({ message: 'Invalid age' });
    }

    // Check if username exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username,
      password,
      name,
      age,
      role
    });

    await user.save();
    console.log('User registered successfully:', username);

    // Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        age: user.age,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Username already exists' });
    }
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    const { username, password, role } = req.body;

    // Validate input
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide username, password, and role' });
    }

    // Find user
    const user = await User.findOne({ username, role });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { 
        _id: user._id,
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Create user response object
    const userResponse = {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role
    };

    // Add isAvailable only for doctors
    if (user.role === 'doctor') {
      userResponse.isAvailable = user.isAvailable;
    }

    console.log('Login successful:', { userId: user._id, role: user.role });
    
    res.json({
      token,
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
});

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Get all available doctors
app.get('/api/doctors', async (req, res) => {
  try {
    console.log('Fetching doctors...');
    const doctors = await User.find({ role: 'doctor' })
      .select('-password')
      .lean();

    console.log('Raw doctors from DB:', doctors);

    const transformedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization || 'General Medicine',
      isAvailable: Boolean(doctor.isAvailable)
    }));

    console.log('Transformed doctors:', transformedDoctors);
    res.json(transformedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get doctor availability
app.get('/api/doctors/:doctorId/availability', authenticateToken, async (req, res) => {
  try {
    console.log('Getting availability for doctor:', req.params.doctorId);
    const doctor = await User.findOne({ 
      _id: req.params.doctorId,
      role: 'doctor'
    }).select('isAvailable');
    
    if (!doctor) {
      console.log('Doctor not found:', req.params.doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    console.log('Doctor availability:', doctor.isAvailable);
    res.json({ isAvailable: doctor.isAvailable || false });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({ message: 'Error fetching doctor availability' });
  }
});

// Update doctor availability
app.put('/api/doctors/:id/availability', authenticateToken, async (req, res) => {
  try {
    const { isAvailable } = req.body;
    const doctorId = req.params.id;

    // Verify the user is a doctor
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can update availability' });
    }

    // Verify the doctor is updating their own availability
    if (req.user._id.toString() !== doctorId) {
      return res.status(403).json({ message: 'Cannot update another doctor\'s availability' });
    }

    const doctor = await User.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    doctor.isAvailable = Boolean(isAvailable);
    await doctor.save();

    res.json({ 
      message: 'Availability updated successfully',
      isAvailable: doctor.isAvailable 
    });
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    res.status(500).json({ message: 'Error updating availability' });
  }
});

// Create appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user._id;

    // Verify the user is a patient
    if (req.user.role !== 'patient') {
      return res.status(403).json({ message: 'Only patients can book appointments' });
    }

    // Verify the doctor exists and is available
    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (!doctor.isAvailable) {
      return res.status(400).json({ message: 'Doctor is not available' });
    }

    // Check if the time slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date,
      time,
      status: { $ne: 'cancelled' }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    // Create the appointment
    const appointment = new Appointment({
      doctorId,
      patientId,
      date,
      time,
      reason,
      status: 'scheduled'
    });

    await appointment.save();

    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// Get appointments for a doctor
app.get('/api/doctors/:doctorId/appointments', authenticateToken, async (req, res) => {
  try {
    console.log('Fetching appointments for doctor:', req.params.doctorId);
    
    const appointments = await Appointment.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ date: 1 });

    console.log('Found appointments:', appointments);
    res.json(appointments);
  } catch (error) {
    console.error('Get doctor appointments error:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Get user's appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctorId: req.user.id }
      : { patientId: req.user.id };

    const appointments = await Appointment.find(query)
      .populate('patientId', 'name username')
      .populate('doctorId', 'name username')
      .sort({ createdAt: -1 })
      .lean();

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Update profile endpoint
app.put('/api/profile', authenticateToken, async (req, res) => {
  try {
    console.log('Profile update request received:', {
      userId: req.user.id,
      body: req.body
    });

    if (!req.user || !req.user.id) {
      console.log('No user ID in request');
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { name, age, pincode } = req.body;

    // Find user first to get username
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log('User not found for ID:', req.user.id);
      return res.status(404).json({ message: 'User not found' });
    }

    // Set default values if not provided
    const updateData = {
      name: name || user.username, // Use username as default name
      age: age ? Number(age) : 20,
      pincode: pincode || '000000'
    };

    // Validate age
    if (isNaN(updateData.age) || updateData.age < 0 || updateData.age > 120) {
      console.log('Invalid age:', updateData.age);
      return res.status(400).json({ message: 'Age must be between 0 and 120' });
    }

    // Validate pincode
    if (!/^\d{6}$/.test(updateData.pincode)) {
      console.log('Invalid pincode:', updateData.pincode);
      return res.status(400).json({ message: 'Pincode must be 6 digits' });
    }

    // Update user fields
    user.name = updateData.name;
    user.age = updateData.age;
    user.pincode = updateData.pincode;

    // Save changes
    await user.save();
    console.log('Profile updated successfully for user:', user.username);

    // Return updated user without password
    res.json({
      message: 'Profile updated successfully',
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Profile update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

// Protected route example
app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
}); 