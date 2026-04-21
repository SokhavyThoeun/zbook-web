/**
 * Admin Routes
 * Administrative dashboard and management endpoints
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate, authorize('admin'));

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);
router.get('/analytics', adminController.getAnalytics);
router.get('/recent-orders', adminController.getRecentOrders);
router.get('/top-books', adminController.getTopBooks);

// User management
router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Book management
router.post('/books', adminController.createBook);
router.put('/books/:id', adminController.updateBook);
router.delete('/books/:id', adminController.deleteBook);

// Order management
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id/status', adminController.updateOrderStatus);

// Inventory management
router.get('/inventory', adminController.getInventory);
router.put('/inventory/:id/stock', adminController.updateStock);

// Reports
router.get('/reports/sales', adminController.getSalesReport);
router.get('/reports/inventory', adminController.getInventoryReport);

module.exports = router;
