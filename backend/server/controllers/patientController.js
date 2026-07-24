const Patient = require('../models/Patient');
const bcrypt = require('bcryptjs');

/**
 * GET /api/patients
 * Get all patients (admin only)
 */
exports.getAllPatients = async (req, res, next) => {
  try {
    const patients = await Patient.find().select('-password');
    res.json({ patients, count: patients.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/:id
 * Get a single patient by ID
 */
exports.getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id).select('-password');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ patient });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/patients/search
 * Search patients by contact number
 */
exports.searchPatientByContact = async (req, res, next) => {
  try {
    const { contact } = req.query;
    const patient = await Patient.findOne({ contact }).select('-password');
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found with this contact' });
    }
    res.json({ patient });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/patients/:id
 * Update a patient's details
 */
exports.updatePatient = async (req, res, next) => {
  try {
    const allowedFields = ['fname', 'lname', 'gender', 'email', 'contact'];
    const updates = {};
    for (const field of allowedFields) {
      if (req.body[field]) updates[field] = req.body[field];
    }

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ patient });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/patients/:id
 * Delete a patient (admin only)
 */
exports.deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    res.json({ message: 'Patient deleted successfully' });
  } catch (err) {
    next(err);
  }
};

