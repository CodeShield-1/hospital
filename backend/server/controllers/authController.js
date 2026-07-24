const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * POST /api/auth/patient/register
 * Register a new patient
 */
exports.registerPatient = async (req, res, next) => {
  try {
    const { fname, lname, gender, email, contact, password, cpassword } = req.body;

    if (password !== cpassword) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }

    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const patient = await Patient.create({
      fname, lname, gender, email, contact, password: hashedPassword
    });

    const token = jwt.sign(
      { id: patient._id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, patient: patient.toJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/patient/login
 * Login as a patient
 */
exports.loginPatient = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: patient._id, email: patient.email, role: 'patient' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, patient: patient.toJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/doctor/login
 * Login as a doctor
 */
exports.loginDoctor = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const doctor = await Doctor.findOne({ username });
    if (!doctor) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: doctor._id, username: doctor.username, role: 'doctor' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, doctor: doctor.toJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/admin/login
 * Login as an admin
 */
exports.loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, admin: admin.toJSON() });
  } catch (err) {
    next(err);
  }
};

