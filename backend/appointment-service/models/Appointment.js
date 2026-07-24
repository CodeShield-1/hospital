const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  fname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true
  },
  lname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    minlength: 10,
    maxlength: 10
  },
  doctor: {
    type: String,
    required: [true, 'Doctor name is required']
  },
  docFees: {
    type: Number,
    required: [true, 'Consultancy fees is required'],
    min: 0
  },
  appdate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  apptime: {
    type: String,
    required: [true, 'Appointment time is required'],
    enum: ['08:00:00', '10:00:00', '12:00:00', '14:00:00', '16:00:00']
  },
  userStatus: {
    type: Number,
    default: 1,
    enum: [0, 1]
  },
  doctorStatus: {
    type: Number,
    default: 1,
    enum: [0, 1]
  }
}, {
  timestamps: true
});

// Compound index to prevent double-booking
appointmentSchema.index({ doctor: 1, appdate: 1, apptime: 1 }, { unique: true });

module.exports = mongoose.model('appointments', appointmentSchema);

