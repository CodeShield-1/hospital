const Doctor = require('../models/Doctor');
const bcrypt = require('bcryptjs');

/**
 * GET /api/doctors
 * Get all doctors
 */
exports.getAllDoctors = async (req, res, next) => {
  try {
    const doctors = await Doctor.find().select('-password');
    res.json({ doctors, count: doctors.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/specializations
 * Get distinct specializations
 */
exports.getSpecializations = async (req, res, next) => {
  try {
    const specs = await Doctor.distinct('spec');
    res.json({ specializations: specs });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/search
 * Search doctor by email
 */
exports.searchDoctorByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const doctor = await Doctor.findOne({ email }).select('-password');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found with this email' });
    }
    res.json({ doctor });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/doctors/:id
 * Get a single doctor by ID
 */
exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select('-password');
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ doctor });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/doctors
 * Add a new doctor (admin only)
 */
exports.addDoctor = async (req, res, next) => {
  try {
    const { username, password, email, spec, docFees } = req.body;

    const existing = await Doctor.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ error: 'Doctor with this email or username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const doctor = await Doctor.create({
      username, password: hashedPassword, email, spec, docFees
    });

    res.status(201).json({ doctor: doctor.toJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/doctors/:id
 * Delete a doctor (admin only)
 */
exports.deleteDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: 'Doctor not found' });
    }
    res.json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    next(err);
  }
};

