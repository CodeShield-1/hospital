const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { authenticate, authorize } = require('../middleware/auth');

// POST /api/contact - Public
router.post('/', contactController.submitContact);

// GET /api/contact - Admin only
router.get('/', authenticate, authorize('admin'), contactController.getAllMessages);

// GET /api/contact/search?contact=xxx
router.get('/search', authenticate, authorize('admin'), contactController.searchMessagesByContact);

module.exports = router;

