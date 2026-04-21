/**
 * Wishlist Controller
 * Handles user's favorite books
 */

const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get user's wishlist
 * GET /api/wishlist
 */
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.userId })
      .populate('bookId')
      .sort('-createdAt');

    sendSuccess(res, 200, 'Wishlist retrieved successfully', wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    sendError(res, 500, 'Error retrieving wishlist');
  }
};

/**
 * Add book to wishlist
 * POST /api/wishlist
 */
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;

    if (!bookId) {
      return sendError(res, 400, 'Please provide book ID');
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return sendError(res, 404, 'Book not found');
    }

    // Check if already in wishlist
    const existing = await Wishlist.findOne({
      userId: req.userId,
      bookId,
    });

    if (existing) {
      return sendError(res, 400, 'Book already in wishlist');
    }

    // Add to wishlist
    const wishlistItem = new Wishlist({
      userId: req.userId,
      bookId,
    });

    await wishlistItem.save();
    await wishlistItem.populate('bookId');

    sendSuccess(res, 201, 'Book added to wishlist', wishlistItem);
  } catch (error) {
    console.error('Add to wishlist error:', error);
    sendError(res, 500, 'Error adding to wishlist');
  }
};

/**
 * Remove book from wishlist
 * DELETE /api/wishlist/:bookId
 */
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const result = await Wishlist.findOneAndDelete({
      userId: req.userId,
      bookId,
    });

    if (!result) {
      return sendError(res, 404, 'Item not found in wishlist');
    }

    sendSuccess(res, 200, 'Book removed from wishlist');
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    sendError(res, 500, 'Error removing from wishlist');
  }
};

/**
 * Check if book is in wishlist
 * GET /api/wishlist/check/:bookId
 */
const checkWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;

    const item = await Wishlist.findOne({
      userId: req.userId,
      bookId,
    });

    sendSuccess(res, 200, 'Check completed', { isInWishlist: !!item });
  } catch (error) {
    console.error('Check wishlist error:', error);
    sendError(res, 500, 'Error checking wishlist');
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};
