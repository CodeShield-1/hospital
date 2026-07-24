const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/doctors - Public
router.get('/', doctorController.getAllDoctors);

// GET /api/doctors/specializations - Public
router.get('/specializations', doctorController.getSpecializations);

// GET /api/doctors/search?email=xxx
router.get('/search', authenticate, doctorController.searchDoctorByEmail);

// GET /api/doctors/:id - Public
router.get('/:id', doctorController.getDoctorById);

// POST /api/doctors - Admin only
router.post('/', authenticate, authorize('admin'), doctorController.addDoctor);

// DELETE /api/doctors/:id - Admin only
router.delete('/:id', authenticate, authorize('admin'), doctorController.deleteDoctor);

module.exports = router;

