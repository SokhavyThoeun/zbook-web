/**
 * Review Controller
 * Handles book reviews and ratings
 */

const Review = require('../models/Review');
const Book = require('../models/Book');
const Order = require('../models/Order');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get reviews for a book
 * GET /api/reviews/book/:bookId
 */
const getBookReviews = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { page = 1, limit = 10, sortBy = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ bookId })
      .skip(skip)
      .limit(parseInt(limit))
      .sort(sortBy)
      .populate('userId', 'username avatar');

    const total = await Review.countDocuments({ bookId });

    sendSuccess(res, 200, 'Reviews retrieved', {
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    sendError(res, 500, 'Error retrieving reviews');
  }
};

/**
 * Create a review
 * POST /api/reviews
 */
const createReview = async (req, res) => {
  try {
    const { bookId, rating, title, comment } = req.body;

    if (!bookId || !rating || !title || !comment) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    if (rating < 1 || rating > 5) {
      return sendError(res, 400, 'Rating must be between 1 and 5');
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return sendError(res, 404, 'Book not found');
    }

    // Check if user has purchased this book
    const order = await Order.findOne({
      userId: req.userId,
      'items.bookId': bookId,
      paymentStatus: 'completed',
    });

    const isVerifiedPurchase = !!order;

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.userId,
    });

    if (existingReview) {
      return sendError(res, 400, 'You have already reviewed this book');
    }

    // Create review
    const review = new Review({
      bookId,
      userId: req.userId,
      rating,
      title,
      comment,
      isVerifiedPurchase,
    });

    await review.save();

    // Update book rating
    const allReviews = await Review.find({ bookId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    book.averageRating = Math.round(avgRating * 10) / 10;
    book.totalReviews = allReviews.length;
    book.reviews.push(review._id);
    await book.save();

    await review.populate('userId', 'username avatar');

    sendSuccess(res, 201, 'Review created successfully', review);
  } catch (error) {
    console.error('Create review error:', error);
    sendError(res, 500, 'Error creating review');
  }
};

/**
 * Update review
 * PUT /api/reviews/:reviewId
 */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findById(reviewId);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (review.userId.toString() !== req.userId) {
      return sendError(res, 403, 'Not authorized to update this review');
    }

    if (rating) {
      if (rating < 1 || rating > 5) {
        return sendError(res, 400, 'Rating must be between 1 and 5');
      }
      review.rating = rating;
    }

    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    // Update book rating
    const allReviews = await Review.find({ bookId: review.bookId });
    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    const book = await Book.findById(review.bookId);
    book.averageRating = Math.round(avgRating * 10) / 10;
    await book.save();

    await review.populate('userId', 'username avatar');

    sendSuccess(res, 200, 'Review updated successfully', review);
  } catch (error) {
    console.error('Update review error:', error);
    sendError(res, 500, 'Error updating review');
  }
};

/**
 * Delete review
 * DELETE /api/reviews/:reviewId
 */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    if (review.userId.toString() !== req.userId) {
      return sendError(res, 403, 'Not authorized to delete this review');
    }

    const bookId = review.bookId;
    await Review.findByIdAndDelete(reviewId);

    // Update book rating and remove review reference
    const book = await Book.findById(bookId);
    book.reviews = book.reviews.filter((r) => r.toString() !== reviewId);

    const allReviews = await Review.find({ bookId });
    if (allReviews.length > 0) {
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      book.averageRating = Math.round(avgRating * 10) / 10;
    } else {
      book.averageRating = 0;
    }

    book.totalReviews = allReviews.length;
    await book.save();

    sendSuccess(res, 200, 'Review deleted successfully');
  } catch (error) {
    console.error('Delete review error:', error);
    sendError(res, 500, 'Error deleting review');
  }
};

/**
 * Mark review as helpful
 * POST /api/reviews/:reviewId/helpful
 */
const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return sendError(res, 404, 'Review not found');
    }

    sendSuccess(res, 200, 'Marked as helpful', review);
  } catch (error) {
    console.error('Mark helpful error:', error);
    sendError(res, 500, 'Error marking as helpful');
  }
};

module.exports = {
  getBookReviews,
  createReview,
  updateReview,
  deleteReview,
  markHelpful,
};
