/**
 * Wishlist Model
 * Stores user's favorite books
 * Uses Mongoose or in-memory mock based on global.usingMockDB
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  // Return mock model
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Wishlist;
} else {
  const mongoose = require('mongoose');

  const wishlistSchema = new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
      },
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

  wishlistSchema.index({ userId: 1, bookId: 1 }, { unique: true });

  module.exports = mongoose.model('Wishlist', wishlistSchema);
}
