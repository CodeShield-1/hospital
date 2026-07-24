const Prescription = require('../models/Prescription');

/**
 * POST /api/prescriptions
 * Create a new prescription (doctor only)
 */
exports.createPrescription = async (req, res, next) => {
  try {
    const {
      doctor, pid, appointmentId, fname, lname,
      appdate, apptime, disease, allergy, prescription
    } = req.body;

    const newPrescription = await Prescription.create({
      doctor, pid, appointmentId, fname, lname,
      appdate, apptime, disease, allergy, prescription
    });

    res.status(201).json({ prescription: newPrescription });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions/patient/:pid
 * Get prescriptions for a specific patient
 */
exports.getPrescriptionsByPatient = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ pid: req.params.pid })
      .sort({ appdate: -1 });
    res.json({ prescriptions, count: prescriptions.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions/doctor/:doctor
 * Get prescriptions by doctor name
 */
exports.getPrescriptionsByDoctor = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find({ doctor: req.params.doctor })
      .sort({ appdate: -1 });
    res.json({ prescriptions, count: prescriptions.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/prescriptions
 * Get all prescriptions (admin/receptionist)
 */
exports.getAllPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.find().sort({ appdate: -1 });
    res.json({ prescriptions, count: prescriptions.length });
  } catch (err) {
    next(err);
  }
};

