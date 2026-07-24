const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

/**
 * POST /api/admin/seed
 * Seed default admin if not exists (development only)
 */
exports.seedAdmin = async (req, res, next) => {
  try {
    const existing = await Admin.findOne({ username: 'admin' });
    if (existing) {
      return res.json({ message: 'Admin already exists' });
    }

    const hashedPassword = await bcrypt.hash('admin123', 12);
    await Admin.create({ username: 'admin', password: hashedPassword });

    res.status(201).json({ message: 'Default admin created (admin/admin123)' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/dashboard
 * Get admin dashboard stats
 */
exports.getDashboardStats = async (req, res, next) => {
  try {
    const Patient = require('../models/Patient');
    const Doctor = require('../models/Doctor');
    const Contact = require('../models/Contact');
    const Prescription = require('../models/Prescription');

    const patientCount = await Patient.countDocuments();
    const doctorCount = await Doctor.countDocuments();
    const messageCount = await Contact.countDocuments();
    const prescriptionCount = await Prescription.countDocuments();

    // Call appointment service for appointment stats
    let appointmentCount = 0;
    try {
      const axios = require('axios');
      const response = await axios.get(`${process.env.APPOINTMENT_SERVICE_URL}/api/appointments/count`, {
        headers: { Authorization: req.headers.authorization }
      });
      appointmentCount = response.data.count;
    } catch (e) {
      console.warn('[Admin] Could not fetch appointment stats:', e.message);
    }

    res.json({
      stats: {
        patients: patientCount,
        doctors: doctorCount,
        appointments: appointmentCount,
        prescriptions: prescriptionCount,
        messages: messageCount
      }
    });
  } catch (err) {
    next(err);
  }
};

