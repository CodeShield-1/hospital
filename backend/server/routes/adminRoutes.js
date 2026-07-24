const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/admin/seed - Seed default admin
router.post('/seed', adminController.seedAdmin);

// GET /api/admin/dashboard - Admin only
router.get('/dashboard', authenticate, authorize('admin'), adminController.getDashboardStats);

module.exports = router;

