/**
 * User Model
 * Defines the structure for user documents
 * Uses Mongoose or in-memory mock based on global.usingMockDB
 */

// Check before requiring mongoose
if (global.usingMockDB) {
  // Return mock model
  const mockDB = require('../config/enhancedMockDatabase');
  module.exports = mockDB.User;
} else {
  const mongoose = require('mongoose');

  const userSchema = new mongoose.Schema(
    {
      username: {
        type: String,
        required: [true, 'Please provide a username'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
      },
      email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          'Please provide a valid email',
        ],
      },
      password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
      },
      fullName: {
        type: String,
        required: [true, 'Please provide your full name'],
      },
      phoneNumber: {
        type: String,
        required: false,
      },
      address: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
        default: 'Phnom Penh',
      },
      country: {
        type: String,
        required: false,
        default: 'Cambodia',
      },
      avatar: {
        type: String,
        required: false,
        default: 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
      },
      isEmailVerified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model('User', userSchema);
}
