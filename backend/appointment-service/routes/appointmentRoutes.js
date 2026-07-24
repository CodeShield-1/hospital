const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// GET /api/appointments - List with optional filters
router.get('/', appointmentController.getAllAppointments);

// GET /api/appointments/count - Total count
router.get('/count', appointmentController.getAppointmentCount);

// GET /api/appointments/doctor/:doctorName - By doctor
router.get('/doctor/:doctorName', appointmentController.getDoctorAppointments);

// GET /api/appointments/patient/:pid - By patient
router.get('/patient/:pid', appointmentController.getPatientAppointments);

// GET /api/appointments/search?contact=xxx - Search by contact
router.get('/search', appointmentController.searchByContact);

// POST /api/appointments - Create new
router.post('/', appointmentController.createAppointment);

// PATCH /api/appointments/:id/cancel/patient - Cancel by patient
router.patch('/:id/cancel/patient', appointmentController.cancelByPatient);

// PATCH /api/appointments/:id/cancel/doctor - Cancel by doctor
router.patch('/:id/cancel/doctor', appointmentController.cancelByDoctor);

module.exports = router;

