/**
 * Review Model
 * Defines the structure for book reviews
 * Uses Mongoose or in-memory mock based on global.usingMockDB
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  // Return mock model
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Review;
} else {
  const mongoose = require('mongoose');

  const reviewSchema = new mongoose.Schema(
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
        index: true,
      },
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
      rating: {
        type: Number,
        required: [true, 'Please provide a rating'],
        min: 1,
        max: 5,
      },
      title: {
        type: String,
        required: [true, 'Please provide a review title'],
        trim: true,
        maxlength: 100,
      },
      comment: {
        type: String,
        required: [true, 'Please provide a review comment'],
        trim: true,
        maxlength: 1000,
      },
      isVerifiedPurchase: {
        type: Boolean,
        default: false,
      },
      helpful: {
        type: Number,
        default: 0,
        min: 0,
      },
      notHelpful: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model('Review', reviewSchema);
}
