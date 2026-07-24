const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/patients - Admin only
router.get('/', authenticate, authorize('admin'), patientController.getAllPatients);

// GET /api/patients/search?contact=xxx - Admin/Receptionist
router.get('/search', authenticate, patientController.searchPatientByContact);

// GET /api/patients/:id - Authenticated users
router.get('/:id', authenticate, patientController.getPatientById);

// PUT /api/patients/:id - Patient or Admin
router.put('/:id', authenticate, patientController.updatePatient);

// DELETE /api/patients/:id - Admin only
router.delete('/:id', authenticate, authorize('admin'), patientController.deletePatient);

module.exports = router;

