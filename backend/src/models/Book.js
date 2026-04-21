/**
 * Book Model
 * Defines the structure for book documents
 * Uses Mongoose or in-memory mock based on global.usingMockDB
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  // Return mock model
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Book;
} else {
  const mongoose = require('mongoose');

  const bookSchema = new mongoose.Schema(
    {
      title: {
        type: String,
        required: [true, 'Please provide book title'],
        trim: true,
        index: true,
      },
      author: {
        type: String,
        required: [true, 'Please provide author name'],
      },
      description: {
        type: String,
        required: [true, 'Please provide book description'],
      },
      isbn: {
        type: String,
        unique: true,
        sparse: true,
      },
      category: {
        type: String,
        enum: [
          'fiction',
          'non-fiction',
          'science',
          'history',
          'biography',
          'romance',
          'mystery',
          'self-help',
          'technology',
          'business',
          'adventure',
          'young-adult',
          'children',
          'cambodian',
        ],
        required: true,
      },
      priceUSD: {
        type: Number,
        required: [true, 'Please provide price in USD'],
        min: 0,
      },
      priceKHR: {
        type: Number,
        required: [true, 'Please provide price in KHR'],
        min: 0,
      },
      discountPercent: {
        type: Number,
        default: 0,
        min: 0,
        max: 100,
      },
      stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
      },
      coverImage: {
        type: String,
        required: true,
      },
      images: [
        {
          type: String,
        },
      ],
      publishedDate: {
        type: Date,
        required: false,
      },
      publisher: {
        type: String,
        required: false,
      },
      pages: {
        type: Number,
        required: false,
      },
      language: {
        type: String,
        default: 'Khmer',
      },
      format: {
        type: String,
        enum: ['hardcover', 'paperback', 'ebook'],
        default: 'paperback',
      },
      averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
      reviews: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Review',
        },
      ],
      tags: [String],
      isTrending: {
        type: Boolean,
        default: false,
        index: true,
      },
      isNew: {
        type: Boolean,
        default: false,
        index: true,
      },
      isPopular: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

  bookSchema.index({ title: 'text', author: 'text', description: 'text' });

  module.exports = mongoose.model('Book', bookSchema);
}
