/**
 * Coupon Routes
 * Handles discount code validation and management
 */

const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { authenticate, authorize } = require('../middleware/auth');

// Public route - validate coupon
router.post('/validate', couponController.validateCoupon);

// Protected admin routes
router.get('/', authenticate, authorize('admin'), couponController.getAllCoupons);
router.post('/', authenticate, authorize('admin'), couponController.createCoupon);
router.put('/:id', authenticate, authorize('admin'), couponController.updateCoupon);
router.delete('/:id', authenticate, authorize('admin'), couponController.deleteCoupon);

module.exports = router;
