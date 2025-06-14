const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age cannot be negative'],
    max: [120, 'Age cannot be more than 120']
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['patient', 'doctor'],
      message: 'Role must be either patient or doctor'
    }
  },
  email: {
    type: String,
    sparse: true,
    default: null
  },
  pincode: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{6}$/.test(v);
      },
      message: props => `${props.value} is not a valid pincode! Pincode must be 6 digits.`
    }
  },
  isAvailable: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create index for username only
userSchema.index({ username: 1 }, { unique: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Remove password when converting to JSON
userSchema.methods.toJSON = function() {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 