const Contact = require('../models/Contact');

/**
 * POST /api/contact
 * Submit a contact message (public)
 */
exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, contact, message } = req.body;
    const newMessage = await Contact.create({ name, email, contact, message });
    res.status(201).json({ message: 'Message sent successfully!', data: newMessage });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/contact
 * Get all contact messages (admin only)
 */
exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ messages, count: messages.length });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/contact/search
 * Search contact messages by phone number
 */
exports.searchMessagesByContact = async (req, res, next) => {
  try {
    const { contact } = req.query;
    const messages = await Contact.find({ contact });
    if (messages.length === 0) {
      return res.status(404).json({ error: 'No messages found for this contact' });
    }
    res.json({ messages });
  } catch (err) {
    next(err);
  }
};

