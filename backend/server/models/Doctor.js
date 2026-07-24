const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  spec: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: ['General', 'Cardiologist', 'Neurologist', 'Pediatrician']
  },
  docFees: {
    type: Number,
    required: [true, 'Consultancy fees is required'],
    min: 0
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);

