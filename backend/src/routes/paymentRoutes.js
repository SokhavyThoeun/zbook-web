/**
 * Payment Routes
 * Handles payment processing and transaction management
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authenticate } = require('../middleware/auth');

// All payment routes require authentication
router.use(authenticate);

// Payment processing
router.post('/create-intent', paymentController.createPaymentIntent);
router.post('/confirm', paymentController.confirmPayment);
router.post('/cash-on-delivery', paymentController.createCashOnDeliveryOrder);

// Payment history
router.get('/history', paymentController.getPaymentHistory);
router.get('/:id', paymentController.getPaymentById);

module.exports = router;
