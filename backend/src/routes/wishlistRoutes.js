/**
 * Wishlist Routes
 */

const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController');
const { authMiddleware } = require('../middleware/auth');

// All wishlist routes require authentication
router.use(authMiddleware);

router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:bookId', wishlistController.removeFromWishlist);
router.get('/check/:bookId', wishlistController.checkWishlist);

module.exports = router;
