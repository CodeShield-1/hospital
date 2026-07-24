const express = require('express');
const router = express.Router();
const prescriptionController = require('../controllers/prescriptionController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/prescriptions - Admin/Receptionist
router.get('/', authenticate, authorize('admin'), prescriptionController.getAllPrescriptions);

// GET /api/prescriptions/patient/:pid - Patient
router.get('/patient/:pid', authenticate, prescriptionController.getPrescriptionsByPatient);

// GET /api/prescriptions/doctor/:doctor - Doctor
router.get('/doctor/:doctor', authenticate, prescriptionController.getPrescriptionsByDoctor);

// POST /api/prescriptions - Doctor only
router.post('/', authenticate, authorize('doctor'), prescriptionController.createPrescription);

module.exports = router;

