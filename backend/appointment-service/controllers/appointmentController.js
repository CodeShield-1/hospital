const Appointment = require('../models/Appointment');

/**
 * GET /api/appointments
 * Get all appointments (filtered by query params)
 */
exports.getAllAppointments = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.doctor) filter.doctor = req.query.doctor;
    if (req.query.contact) filter.contact = req.query.contact;
    if (req.query.pid) filter.pid = req.query.pid;
    if (req.query.status) {
      if (req.query.status === 'active') {
        filter.userStatus = 1;
        filter.doctorStatus = 1;
      } else if (req.query.status === 'cancelled') {
        filter.$or = [{ userStatus: 0 }, { doctorStatus: 0 }];
      }
    }

    const appointments = await Appointment.find(filter).sort({ appdate: -1 });
    res.json({ appointments, count: appointments.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/count
 * Returns total appointment count
 */
exports.getAppointmentCount = async (req, res, next) => {
  try {
    const count = await Appointment.countDocuments();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/doctor/:doctorName
 * Get appointments for a specific doctor
 */
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      doctor: req.params.doctorName
    }).sort({ appdate: -1 });
    res.json({ appointments, count: appointments.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/patient/:pid
 * Get appointments for a specific patient
 */
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({
      pid: req.params.pid
    }).sort({ appdate: -1 });
    res.json({ appointments, count: appointments.length });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/appointments
 * Create a new appointment
 */
exports.createAppointment = async (req, res, next) => {
  try {
    const {
      pid, fname, lname, gender, email, contact,
      doctor, docFees, appdate, apptime
    } = req.body;

    // Validate future date/time
    const appDateObj = new Date(appdate);
    const now = new Date();
    if (appDateObj < new Date(now.toDateString())) {
      return res.status(400).json({ error: 'Appointment date must be in the future' });
    }

    if (appDateObj.toDateString() === now.toDateString()) {
      const [hours, minutes] = apptime.split(':');
      const appTimeDate = new Date();
      appTimeDate.setHours(parseInt(hours), parseInt(minutes), 0);
      if (appTimeDate <= now) {
        return res.status(400).json({ error: 'Appointment time must be in the future' });
      }
    }

    // Check for double-booking (unique compound index will also catch this)
    const existing = await Appointment.findOne({
      doctor, appdate: appDateObj, apptime
    });
    if (existing) {
      return res.status(409).json({
        error: 'Doctor is not available at this time/date. Please choose a different slot.'
      });
    }

    const appointment = await Appointment.create({
      pid, fname, lname, gender, email, contact,
      doctor, docFees, appdate: appDateObj, apptime,
      userStatus: 1, doctorStatus: 1
    });

    res.status(201).json({ appointment });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: 'This time slot is already booked for this doctor.'
      });
    }
    next(err);
  }
};

/**
 * PATCH /api/appointments/:id/cancel/patient
 * Cancel appointment by patient
 */
exports.cancelByPatient = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { userStatus: 0 },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    next(err);
  }
};

/**
 * PATCH /api/appointments/:id/cancel/doctor
 * Cancel appointment by doctor
 */
exports.cancelByDoctor = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { doctorStatus: 0 },
      { new: true }
    );
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found' });
    }
    res.json({ message: 'Appointment cancelled successfully', appointment });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/appointments/search
 * Search appointments by contact number
 */
exports.searchByContact = async (req, res, next) => {
  try {
    const { contact } = req.query;
    const appointments = await Appointment.find({ contact });
    if (appointments.length === 0) {
      return res.status(404).json({ error: 'No appointments found for this contact' });
    }
    res.json({ appointments });
  } catch (err) {
    next(err);
  }
};

