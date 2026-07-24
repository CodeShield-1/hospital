const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: 20
  },
  lname: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: 20
  },
  gender: {
    type: String,
    required: true,
    enum: ['Male', 'Female']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  contact: {
    type: String,
    required: [true, 'Contact number is required'],
    minlength: 10,
    maxlength: 10
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.pid = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    }
  }
});

module.exports = mongoose.model('Patient', patientSchema);

