/**
 * Book Routes
 */

const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/trending', bookController.getTrendingBooks);
router.get('/new', bookController.getNewBooks);
router.get('/popular', bookController.getPopularBooks);
router.get('/search/suggestions', bookController.searchSuggestions);
router.get('/category/:category', bookController.getByCategory);
router.get('/:id', bookController.getBookById);
router.get('/:id/recommendations', bookController.getRecommendations);

module.exports = router;
