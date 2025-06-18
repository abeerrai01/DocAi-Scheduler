const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
    default: 20
  },
  pincode: {
    type: String,
    required: true,
    match: /^\d{6}$/,
    default: '000000'
  },
  role: {
    type: String,
    required: true,
    enum: ['patient', 'doctor'],
    default: 'patient'
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    },
    validate: {
      validator: function(v) {
        if (this.role === 'doctor') {
          return v && v.trim().length > 0;
        }
        return true;
      },
      message: 'Specialization is required for doctors'
    }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: function() {
        return this.role === 'doctor';
      },
      validate: {
        validator: function(v) {
          if (this.role === 'doctor') {
            return v && Array.isArray(v) && v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && 
                   v[1] >= -90 && v[1] <= 90;
          }
          return true;
        },
        message: 'Valid coordinates are required for doctors. Must be [longitude, latitude]'
      }
    }
  },
  email: {
    type: String,
    sparse: true,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Remove sensitive fields
      delete ret.password;
      delete ret.__v;
      
      // Transform _id to id
      ret.id = ret._id;
      delete ret._id;
      
      // Only include isAvailable, specialization, and location for doctors
      if (ret.role !== 'doctor') {
        delete ret.isAvailable;
        delete ret.specialization;
        delete ret.location;
      } else {
        // Ensure isAvailable is a boolean for doctors
        ret.isAvailable = Boolean(ret.isAvailable);
        // Ensure specialization is included for doctors
        ret.specialization = ret.specialization || 'General Medicine';
      }
      
      return ret;
    }
  }
});

// Create indexes
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ location: '2dsphere' }); // Create geospatial index

// Set isAvailable based on role before saving
userSchema.pre('save', async function(next) {
  const user = this;
  
  // Hash password if modified
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  
  // Set isAvailable for doctors
  if (user.role === 'doctor' && user.isModified('role')) {
    user.isAvailable = false;
  }
  
  // Ensure doctor-specific fields are properly set
  if (user.role === 'doctor') {
    // Ensure specialization is not empty
    if (!user.specialization || user.specialization.trim() === '') {
      return next(new Error('Specialization is required for doctors'));
    }
    
    // Ensure location coordinates are valid
    if (!user.location || !user.location.coordinates || 
        !Array.isArray(user.location.coordinates) || 
        user.location.coordinates.length !== 2) {
      return next(new Error('Valid location coordinates are required for doctors'));
    }
  } else {
    // For non-doctors, remove doctor-specific fields
    user.specialization = undefined;
    user.location = undefined;
    user.isAvailable = undefined;
  }
  
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  
  // Transform _id to id
  userObject.id = userObject._id;
  delete userObject._id;
  
  // Only include isAvailable and location for doctors
  if (userObject.role !== 'doctor') {
    delete userObject.isAvailable;
    delete userObject.location;
  } else {
    // Ensure isAvailable is a boolean for doctors
    userObject.isAvailable = Boolean(userObject.isAvailable);
  }
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 
