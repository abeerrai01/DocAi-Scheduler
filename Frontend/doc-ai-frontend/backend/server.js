const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log('Connected to MongoDB');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
  } catch (err) {
    console.error('MongoDB connection error:', err);
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

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
const auth = async (req, res, next) => {
  try {
    console.log('Auth headers:', req.headers);
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Invalid auth header format');
      return res.status(401).json({ message: 'Please authenticate with a valid Bearer token' });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Extracted token:', token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    res.status(401).json({ message: 'Please authenticate' });
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
    const { username, password, role } = req.body;
    console.log('Login attempt for username:', username);
    console.log('Requested role:', role);

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify role matches
    if (user.role !== role) {
      const errorMessage = user.role === 'doctor' 
        ? 'You are registered as a doctor. Please select "Doctor" role to login.'
        : 'You are registered as a patient. Please select "Patient" role to login.';
      
      return res.status(403).json({ 
        message: errorMessage,
        actualRole: user.role
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', username);
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isAvailable: user.isAvailable
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

app.get('/api/auth/me', auth, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
});

// Get all doctors
app.get('/api/doctors', auth, async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    console.error('Get doctors error:', error);
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get doctor availability
app.get('/api/doctors/:doctorId/availability', auth, async (req, res) => {
  try {
    console.log('Getting availability for doctor:', req.params.doctorId);
    const doctor = await User.findById(req.params.doctorId);
    
    if (!doctor) {
      console.log('Doctor not found:', req.params.doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }

    if (doctor.role !== 'doctor') {
      console.log('User is not a doctor:', req.params.doctorId);
      return res.status(403).json({ message: 'User is not a doctor' });
    }

    console.log('Doctor availability:', doctor.isAvailable);
    res.json({ isAvailable: doctor.isAvailable || false });
  } catch (error) {
    console.error('Get doctor availability error:', error);
    res.status(500).json({ message: 'Error fetching doctor availability' });
  }
});

// Update doctor availability
app.put('/api/doctors/:doctorId/availability', auth, async (req, res) => {
  try {
    console.log('Updating availability for doctor:', req.params.doctorId);
    console.log('Request body:', req.body);
    
    const { isAvailable } = req.body;
    const doctor = await User.findById(req.params.doctorId);
    
    if (!doctor) {
      console.log('Doctor not found:', req.params.doctorId);
      return res.status(404).json({ message: 'Doctor not found' });
    }
    
    if (doctor.role !== 'doctor') {
      console.log('User is not a doctor:', req.params.doctorId);
      return res.status(403).json({ message: 'User is not a doctor' });
    }
    
    // Only allow doctors to update their own availability
    if (req.user.id !== doctor.id) {
      console.log('Unauthorized update attempt. User:', req.user.id, 'Doctor:', doctor.id);
      return res.status(403).json({ message: 'Not authorized to update this doctor\'s availability' });
    }
    
    doctor.isAvailable = isAvailable;
    await doctor.save();
    
    console.log('Updated doctor availability:', doctor.isAvailable);
    res.json({ isAvailable: doctor.isAvailable });
  } catch (error) {
    console.error('Update doctor availability error:', error);
    res.status(500).json({ message: 'Error updating doctor availability' });
  }
});

// Create appointment
app.post('/api/appointments', auth, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const appointment = new Appointment({
      patient: req.user._id,
      doctor: doctorId,
      date,
      time,
      reason
    });

    await appointment.save();
    res.status(201).json(appointment);
  } catch (error) {
    console.error('Create appointment error:', error);
    res.status(500).json({ message: 'Error creating appointment' });
  }
});

// Get user's appointments
app.get('/api/appointments', auth, async (req, res) => {
  try {
    const query = req.user.role === 'doctor' 
      ? { doctor: req.user._id }
      : { patient: req.user._id };

    const appointments = await Appointment.find(query)
      .populate('patient', 'name')
      .populate('doctor', 'name')
      .sort({ date: 1, time: 1 });

    res.json(appointments);
  } catch (error) {
    console.error('Get appointments error:', error);
    res.status(500).json({ message: 'Error fetching appointments' });
  }
});

// Update user profile
app.put('/api/users/profile', auth, async (req, res) => {
  try {
    console.log('Profile update request received:', {
      userId: req.user._id,
      body: req.body
    });

    const { name, pincode } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for ID:', userId);
      return res.status(404).json({ message: 'User not found' });
    }

    // Update basic info
    if (name) {
      console.log('Updating name from', user.name, 'to', name);
      user.name = name;
    }
    
    if (pincode) {
      if (!/^\d{6}$/.test(pincode)) {
        console.log('Invalid pincode format:', pincode);
        return res.status(400).json({ message: 'Invalid pincode format' });
      }
      console.log('Updating pincode from', user.pincode, 'to', pincode);
      user.pincode = pincode;
    }

    await user.save();
    console.log('Profile updated successfully for user:', userId);

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        pincode: user.pincode
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
}); 