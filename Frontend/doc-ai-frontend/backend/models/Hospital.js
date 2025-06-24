const mongoose = require('mongoose');

const HospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  hospitalId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String },
  ambulances: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 }
  },
  doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Hospital', HospitalSchema); 