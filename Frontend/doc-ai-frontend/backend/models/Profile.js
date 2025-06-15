const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
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
    max: 120
  },
  pincode: {
    type: String,
    required: true,
    match: /^\d{6}$/,
    default: '000000'
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      // Transform _id to id
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Create index for userId
profileSchema.index({ userId: 1 }, { unique: true });

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile; 