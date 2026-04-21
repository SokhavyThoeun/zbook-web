/**
 * Review Routes
 */

const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { authMiddleware } = require('../middleware/auth');

// Public routes
router.get('/book/:bookId', reviewController.getBookReviews);

// Protected routes
router.post('/', authMiddleware, reviewController.createReview);
router.put('/:reviewId', authMiddleware, reviewController.updateReview);
router.delete('/:reviewId', authMiddleware, reviewController.deleteReview);
router.post('/:reviewId/helpful', authMiddleware, reviewController.markHelpful);

module.exports = router;
