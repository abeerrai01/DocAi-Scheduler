const mongoose = require('mongoose');
require('dotenv').config();

console.log('Starting invalid users fix script...');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get the User model
    const User = require('./models/User');
    
    // Find all doctor users with missing or invalid specialization
    const doctorsWithoutSpecialization = await User.find({
      role: 'doctor',
      $or: [
        { specialization: { $exists: false } },
        { specialization: null },
        { specialization: '' }
      ]
    });
    
    console.log(`Found ${doctorsWithoutSpecialization.length} doctors without specialization`);
    
    // Fix doctors without specialization
    for (const doctor of doctorsWithoutSpecialization) {
      console.log(`Fixing doctor: ${doctor.username}`);
      doctor.specialization = 'General Medicine';
      await doctor.save();
      console.log(`Fixed specialization for doctor: ${doctor.username}`);
    }
    
    // Find all doctor users with missing or invalid location
    const doctorsWithoutLocation = await User.find({
      role: 'doctor',
      $or: [
        { location: { $exists: false } },
        { location: null },
        { 'location.coordinates': { $exists: false } },
        { 'location.coordinates': null }
      ]
    });
    
    console.log(`Found ${doctorsWithoutLocation.length} doctors without location`);
    
    // Fix doctors without location (set to a default location - you might want to change this)
    for (const doctor of doctorsWithoutLocation) {
      console.log(`Fixing location for doctor: ${doctor.username}`);
      doctor.location = {
        type: 'Point',
        coordinates: [0, 0] // Default coordinates - you might want to set this to a more appropriate location
      };
      await doctor.save();
      console.log(`Fixed location for doctor: ${doctor.username}`);
    }
    
    // Find all patient users with doctor-specific fields that should be removed
    const patientsWithDoctorFields = await User.find({
      role: 'patient',
      $or: [
        { specialization: { $exists: true } },
        { location: { $exists: true } },
        { isAvailable: { $exists: true } }
      ]
    });
    
    console.log(`Found ${patientsWithDoctorFields.length} patients with doctor fields`);
    
    // Remove doctor-specific fields from patients
    for (const patient of patientsWithDoctorFields) {
      console.log(`Cleaning patient: ${patient.username}`);
      patient.specialization = undefined;
      patient.location = undefined;
      patient.isAvailable = undefined;
      await patient.save();
      console.log(`Cleaned patient: ${patient.username}`);
    }
    
    console.log('Successfully fixed all invalid users!');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing invalid users:', error);
    process.exit(1);
  }
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
}); 