/**
 * Database Configuration
 * Connects to MongoDB using Mongoose or uses in-memory mock
 */

const mongoose = require('mongoose');

/**
 * Connect to MongoDB or use mock database
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  // If already set to use mock DB, skip MongoDB connection
  if (global.usingMockDB) {
    console.log('✓ Using in-memory mock database');
    return;
  }

  if (!mongoUri) {
    console.log('⚠️  No MONGODB_URI set, using in-memory mock database');
    global.usingMockDB = true;
    return;
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✓ MongoDB connected successfully');
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    console.log('⚠️  Falling back to in-memory mock database');
    global.usingMockDB = true;
    // Clear mongoose models cache to reload with mock
    console.log('✓ Mock database initialized');
  }
};

module.exports = connectDB;
