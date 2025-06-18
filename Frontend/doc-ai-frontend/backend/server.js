const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('./models/User');
const Appointment = require('./models/Appointment');
const Profile = require('./models/Profile');

const app = express();

// =========================
// ✅ Middleware Setup
// =========================

// CORS Configuration
const allowedOrigins = [
  'https://doc-ai-4sty.onrender.com',
  'https://doc-ai-scheduler.vercel.app',
  'https://docai-frontend-backend-production.up.railway.app',
  'https://docai-scheduler-production.up.railway.app',
  'https://doc-ai-ml.onrender.com',
  'http://localhost:5173', // Development
  'http://localhost:3000'  // Development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// =========================
// ✅ MongoDB Connection
// =========================

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/docai-scheduler';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB:', MONGODB_URI))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// =========================
// ✅ Health Check
// =========================
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// =========================
// ✅ Auth Middleware
// =========================
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid or expired token' });
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ message: 'Authentication error' });
  }
};

// =========================
// ✅ Auth Routes
// =========================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, name, age, role, pincode, specialization, location } = req.body;

    if (!username || !password || !name || !age || !role)
      return res.status(400).json({ message: 'All fields are required' });

    if (!['patient', 'doctor'].includes(role))
      return res.status(400).json({ message: 'Invalid role' });

    if (isNaN(age) || age < 0 || age > 120)
      return res.status(400).json({ message: 'Invalid age' });

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: 'Username already exists' });

    // Validate required fields for doctors
    if (role === 'doctor') {
      if (!specialization || specialization.trim() === '') {
        return res.status(400).json({ message: 'Specialization is required for doctors' });
      }
      if (!location || !location.coordinates || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
        return res.status(400).json({ message: 'Valid location data is required for doctors' });
      }
    }

    // Prepare user data
    const userData = {
      username,
      password,
      name,
      age,
      role,
      pincode: pincode || '000000'
    };

    // Add doctor-specific fields only if role is doctor
    if (role === 'doctor') {
      userData.specialization = specialization;
      userData.location = location;
    }

    const user = new User(userData);
    await user.save();

    const profile = new Profile({
      userId: user._id,
      username: user.username,
      name: user.name,
      age: user.age,
      pincode: user.pincode
    });
    await profile.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        username: user.username,
        name: user.name,
        age: user.age,
        role: user.role,
        specialization: user.specialization,
        location: user.location
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password || !role)
      return res.status(400).json({ message: 'Missing fields' });

    const user = await User.findOne({ username, role });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({
      _id: user._id,
      username: user.username,
      role: user.role
    }, process.env.JWT_SECRET, { expiresIn: '24h' });

    const userResponse = {
      _id: user._id,
      username: user.username,
      name: user.name,
      role: user.role
    };

    if (user.role === 'doctor') {
      userResponse.isAvailable = user.isAvailable;
      userResponse.specialization = user.specialization;
    }

    res.json({ token, user: userResponse });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json(req.user);
});

// =========================
// ✅ Doctor & Appointment APIs
// =========================

// Get all doctors
app.get('/api/doctors', async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password').lean();
    res.json(doctors.map(doc => ({
      _id: doc._id,
      name: doc.name,
      specialization: doc.specialization || 'General Medicine',
      isAvailable: Boolean(doc.isAvailable)
    })));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching doctors' });
  }
});

// Get availability
app.get('/api/doctors/:doctorId/availability', authenticateToken, async (req, res) => {
  const doctor = await User.findOne({ _id: req.params.doctorId, role: 'doctor' }).select('isAvailable');
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
  res.json({ isAvailable: doctor.isAvailable || false });
});

// Update availability
app.put('/api/doctors/:id/availability', authenticateToken, async (req, res) => {
  const { isAvailable } = req.body;
  const doctorId = req.params.id;

  if (req.user.role !== 'doctor' || req.user._id !== doctorId)
    return res.status(403).json({ message: 'Not allowed' });

  const doctor = await User.findById(doctorId);
  if (!doctor) return res.status(404).json({ message: 'Doctor not found' });

  doctor.isAvailable = Boolean(isAvailable);
  await doctor.save();

  res.json({ message: 'Availability updated', isAvailable: doctor.isAvailable });
});

// Create appointment
app.post('/api/appointments', authenticateToken, async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;

    if (req.user.role !== 'patient')
      return res.status(403).json({ message: 'Only patients can book appointments' });

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor || !doctor.isAvailable)
      return res.status(400).json({ message: 'Doctor not available' });

    const exists = await Appointment.findOne({
      doctorId, date, time, status: { $ne: 'cancelled' }
    });
    if (exists) return res.status(400).json({ message: 'Slot already booked' });

    const appointment = new Appointment({
      doctorId,
      patientId: req.user._id,
      date,
      time,
      reason,
      status: 'scheduled'
    });
    await appointment.save();

    res.status(201).json({ message: 'Booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Error booking appointment' });
  }
});

// Get doctor appointments
app.get('/api/doctors/:doctorId/appointments', authenticateToken, async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.params.doctorId })
    .populate('patientId', 'name age')
    .populate('doctorId', 'name')
    .sort({ date: 1 });

  res.json(appointments);
});

// Get logged-in user's appointments
app.get('/api/appointments', authenticateToken, async (req, res) => {
  const query = req.user.role === 'doctor'
    ? { doctorId: req.user._id }
    : { patientId: req.user._id };

  const appointments = await Appointment.find(query)
    .populate('patientId', 'name username')
    .populate('doctorId', 'name username')
    .sort({ createdAt: -1 });

  res.json(appointments);
});

// Find nearby doctors
app.get('/api/doctors/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 50000 } = req.query; // maxDistance in meters, default 50km

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Location coordinates are required' });
    }

    const doctors = await User.find({
      role: 'doctor',
      isAvailable: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    })
    .select('name username specialization location')
    .limit(10)
    .lean();

    // Transform the response to include distance
    const transformedDoctors = doctors.map(doctor => ({
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization || 'General Medicine',
      location: doctor.location,
      isAvailable: true
    }));

    res.json(transformedDoctors);
  } catch (error) {
    console.error('Error finding nearby doctors:', error);
    res.status(500).json({ message: 'Error finding nearby doctors' });
  }
});

// =========================
// ✅ Profile Routes
// =========================

app.get('/api/profile', authenticateToken, async (req, res) => {
  let profile = await Profile.findOne({ userId: req.user.userId });
  if (!profile) {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    profile = new Profile({
      userId: user._id,
      username: user.username,
      name: user.name,
      age: user.age,
      pincode: user.pincode
    });
    await profile.save();
  }
  res.json(profile);
});

app.put('/api/profile', authenticateToken, async (req, res) => {
  const { name, age, pincode } = req.body;

  if (!name || !age || !pincode || isNaN(age) || !/^\d{6}$/.test(pincode))
    return res.status(400).json({ message: 'Invalid input' });

  let profile = await Profile.findOneAndUpdate(
    { userId: req.user.userId },
    { name, age: parseInt(age), pincode },
    { new: true }
  );

  if (!profile) {
    const user = await User.findById(req.user.userId);
    profile = new Profile({
      userId: user._id,
      username: user.username,
      name,
      age: parseInt(age),
      pincode
    });
    await profile.save();
  }

  res.json(profile);
});

// =========================
// ✅ Start Server
// =========================
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
