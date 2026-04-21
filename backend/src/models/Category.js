/**
 * Category Model
 * Defines the structure for category documents
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.Category;
} else {
  const mongoose = require('mongoose');

  const categorySchema = new mongoose.Schema(
    {
      id: {
        type: String,
        required: true,
        unique: true,
      },
      name: {
        type: String,
        required: [true, 'Please provide category name'],
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        default: 'Book',
      },
      isActive: {
        type: Boolean,
        default: true,
      },
      sortOrder: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model('Category', categorySchema);
}
