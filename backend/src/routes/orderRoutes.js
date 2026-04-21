/**
 * Order Routes
 */

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { authMiddleware } = require('../middleware/auth');

// All order routes require authentication
router.use(authMiddleware);

// Order management
router.post('/', orderController.createOrder);
router.get('/', orderController.getUserOrders);
router.get('/:id', orderController.getOrderById);
router.get('/:id/track', orderController.trackOrder);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
