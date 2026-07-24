const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  contact: {
    type: String,
    required: [true, 'Phone number is required'],
    minlength: 10,
    maxlength: 10
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 200
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);

