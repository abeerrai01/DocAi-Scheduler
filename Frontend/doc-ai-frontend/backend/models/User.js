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
      
      // Only include isAvailable and specialization for doctors
      if (ret.role !== 'doctor') {
        delete ret.isAvailable;
        delete ret.specialization;
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

// Create index for username only
userSchema.index({ username: 1 }, { unique: true });

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
  
  // Only include isAvailable for doctors
  if (userObject.role !== 'doctor') {
    delete userObject.isAvailable;
  } else {
    // Ensure isAvailable is a boolean for doctors
    userObject.isAvailable = Boolean(userObject.isAvailable);
  }
  
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 