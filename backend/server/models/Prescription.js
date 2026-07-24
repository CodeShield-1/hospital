const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctor: {
    type: String,
    required: true
  },
  pid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'appointments',
    required: true
  },
  fname: {
    type: String,
    required: true
  },
  lname: {
    type: String,
    required: true
  },
  appdate: {
    type: Date,
    required: true
  },
  apptime: {
    type: String,
    required: true
  },
  disease: {
    type: String,
    required: [true, 'Disease description is required'],
    maxlength: 250
  },
  allergy: {
    type: String,
    required: [true, 'Allergy information is required'],
    maxlength: 250
  },
  prescription: {
    type: String,
    required: [true, 'Prescription is required'],
    maxlength: 1000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prescription', prescriptionSchema);

