/**
 * Express Server - Enhanced Production Version
 * Main application entry point with full-stack features
 */

require('dotenv').config();

const mongoose = require('mongoose');

// Initialize express
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({
    message: 'Z Book Server is running',
    timestamp: new Date(),
    mockDB: global.usingMockDB || false,
    version: '1.0.0'
  });
});

// Function to start server with appropriate database
async function startServer() {
  const mongoUri = process.env.MONGODB_URI;

  // Try to connect to MongoDB if URI is provided
  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('✓ MongoDB connected successfully');
      global.usingMockDB = false;
    } catch (error) {
      console.error('✗ MongoDB connection failed:', error.message);
      console.log('⚠️  Falling back to in-memory mock database');
      global.usingMockDB = true;
    }
  } else {
    console.log('⚠️  No MONGODB_URI set, using in-memory mock database');
    global.usingMockDB = true;
  }

  // Now require routes AFTER global.usingMockDB is set
  const authRoutes = require('./routes/authRoutes');
  const bookRoutes = require('./routes/bookRoutes');
  const orderRoutes = require('./routes/orderRoutes');
  const wishlistRoutes = require('./routes/wishlistRoutes');
  const reviewRoutes = require('./routes/reviewRoutes');
  const categoryRoutes = require('./routes/categoryRoutes');
  const adminRoutes = require('./routes/adminRoutes');
  const paymentRoutes = require('./routes/paymentRoutes');
  const couponRoutes = require('./routes/couponRoutes');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/books', bookRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/payments', paymentRoutes);
  app.use('/api/coupons', couponRoutes);

  // 404 handler
  app.use('*', (req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    });
  });

  // Error handling middleware
  app.use(errorHandler);

  // Get database info
  const db = global.usingMockDB ? require('./config/enhancedMockDatabase') : null;
  const bookCount = global.usingMockDB && db ? db._db.books.length : 'MongoDB';
  const categoryCount = global.usingMockDB && db ? db._db.categories.length : 'MongoDB';

  // Start server
  app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           🚀 Z BOOK SERVER - PRODUCTION READY             ║
╠════════════════════════════════════════════════════════════╣
║  Server: http://localhost:${PORT}                            ║
║  Database: ${global.usingMockDB ? 'In-Memory (Mock)' : 'MongoDB'}${' '.repeat(20 - (global.usingMockDB ? 18 : 7))} ║
║  Books: ${bookCount}${' '.repeat(27 - String(bookCount).length)} ║
║  Categories: ${categoryCount}${' '.repeat(22 - String(categoryCount).length)} ║
╠════════════════════════════════════════════════════════════╣
║  API Endpoints:                                            ║
║  • Auth:      /api/auth                                    ║
║  • Books:     /api/books                                   ║
║  • Categories:/api/categories                              ║
║  • Orders:    /api/orders                                  ║
║  • Payments:  /api/payments                                ║
║  • Wishlist:  /api/wishlist                                ║
║  • Reviews:   /api/reviews                                 ║
║  • Coupons:   /api/coupons                                 ║
║  • Admin:     /api/admin                                   ║
╚════════════════════════════════════════════════════════════╝
`);

    if (global.usingMockDB) {
      console.log('✓ Enhanced mock database loaded with 700+ books');
      console.log('✓ Default accounts: admin@zbook.com / demo@zbook.com');
      console.log('✓ Sample coupons: WELCOME20, SUMMER15, STUDENT10, VIP25');
    }
    console.log('');
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
