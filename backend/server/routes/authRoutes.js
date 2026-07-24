const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/patient/register
router.post('/patient/register', authController.registerPatient);

// POST /api/auth/patient/login
router.post('/patient/login', authController.loginPatient);

// POST /api/auth/doctor/login
router.post('/doctor/login', authController.loginDoctor);

// POST /api/auth/admin/login
router.post('/admin/login', authController.loginAdmin);

module.exports = router;

