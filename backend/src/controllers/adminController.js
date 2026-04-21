/**
 * Admin Controller
 * Handles administrative operations and dashboard data
 */

const Book = require('../models/Book');
const User = require('../models/User');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Get dashboard statistics
exports.getDashboardStats = async (req, res, next) => {
  try {
    const [totalBooks, totalUsers, totalOrders, totalRevenue] = await Promise.all([
      Book.countDocuments({}).exec(),
      User.countDocuments({}).exec(),
      Order.countDocuments({}).exec(),
      Order.find({ status: { $ne: 'cancelled' } }).then(orders =>
        orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
      ),
    ]);

    // Get monthly sales (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlySales = await Order.find({
      createdAt: { $gte: sixMonthsAgo },
      status: { $ne: 'cancelled' },
    }).then(orders => {
      const months = {};
      orders.forEach(order => {
        const month = order.createdAt.toISOString().slice(0, 7);
        months[month] = (months[month] || 0) + (order.totalAmount || 0);
      });
      return Object.entries(months).map(([month, revenue]) => ({
        month,
        revenue: Math.round(revenue * 100) / 100,
      }));
    });

    // Get category distribution
    const categories = await Category.find({}).exec();
    const categoryDistribution = await Promise.all(
      categories.map(async (cat) => {
        const count = await Book.countDocuments({ category: cat.id }).exec();
        return { name: cat.name, count };
      })
    );

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        totalUsers,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        monthlySales,
        categoryDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get detailed analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { period = '30days' } = req.query;
    const now = new Date();
    const periods = {
      '7days': 7,
      '30days': 30,
      '90days': 90,
      '1year': 365,
    };
    const days = periods[period] || 30;
    const startDate = new Date(now - days * 24 * 60 * 60 * 1000);

    // New users in period
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate },
    }).exec();

    // Orders in period
    const periodOrders = await Order.find({
      createdAt: { $gte: startDate },
    }).exec();

    const periodRevenue = periodOrders.reduce((sum, order) =>
      sum + (order.status !== 'cancelled' ? (order.totalAmount || 0) : 0), 0
    );

    // Average order value
    const avgOrderValue = periodOrders.length > 0
      ? periodRevenue / periodOrders.length
      : 0;

    // Top selling books in period
    const bookSales = {};
    periodOrders.forEach(order => {
      order.items?.forEach(item => {
        if (item.book) {
          const bookId = typeof item.book === 'string' ? item.book : item.book._id;
          bookSales[bookId] = (bookSales[bookId] || 0) + item.quantity;
        }
      });
    });

    const topBooks = Object.entries(bookSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([bookId, quantity]) => ({ bookId, quantity }));

    res.status(200).json({
      success: true,
      data: {
        period,
        newUsers,
        totalOrders: periodOrders.length,
        revenue: Math.round(periodRevenue * 100) / 100,
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        topBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get recent orders
exports.getRecentOrders = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get top books
exports.getTopBooks = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const books = await Book.find({})
      .sort({ totalReviews: -1, averageRating: -1 })
      .limit(parseInt(limit))
      .exec();

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, role } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (role) filter.role = role;

    const users = await User.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .exec();

    const total = await User.countDocuments(filter).exec();

    // Remove password from response
    const sanitizedUsers = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    res.status(200).json({
      success: true,
      count: sanitizedUsers.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: sanitizedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Remove password
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isEmailVerified } = req.body;

    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const updateData = {};
    if (role) updateData.role = role;
    if (isEmailVerified !== undefined) updateData.isEmailVerified = isEmailVerified;

    await User.updateOne({ _id: req.params.id }, { $set: updateData });

    res.status(200).json({
      success: true,
      data: { ...user, ...updateData },
    });
  } catch (error) {
    next(error);
  }
};

// Delete user
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).exec();
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent deleting yourself
    if (req.params.id === req.user._id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    await User.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Create book
exports.createBook = async (req, res, next) => {
  try {
    const bookData = req.body;

    // Validate required fields
    if (!bookData.title || !bookData.author || !bookData.category || !bookData.priceUSD) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, author, category, and price',
      });
    }

    // Calculate KHR price
    bookData.priceKHR = bookData.priceKHR || Math.round(bookData.priceUSD * 4050);

    const book = await Book.create(bookData);

    res.status(201).json({
      success: true,
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

// Update book
exports.updateBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).exec();
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    const updateData = req.body;

    // Recalculate KHR if USD changed
    if (updateData.priceUSD && !updateData.priceKHR) {
      updateData.priceKHR = Math.round(updateData.priceUSD * 4050);
    }

    await Book.updateOne({ _id: req.params.id }, { $set: updateData });

    res.status(200).json({
      success: true,
      data: { ...book, ...updateData },
    });
  } catch (error) {
    next(error);
  }
};

// Delete book
exports.deleteBook = async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).exec();
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await Book.deleteOne({ _id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders
exports.getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filter = {};
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Order.countDocuments(filter).exec();

    res.status(200).json({
      success: true,
      count: orders.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Please provide status',
      });
    }

    const order = await Order.findById(req.params.id).exec();
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    await Order.updateOne(
      { _id: req.params.id },
      { $set: { status, updatedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      data: { ...order, status },
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory
exports.getInventory = async (req, res, next) => {
  try {
    const { lowStock = false } = req.query;

    let filter = {};
    if (lowStock === 'true') {
      filter = { stock: { $lte: 10 } };
    }

    const books = await Book.find(filter)
      .sort({ stock: 1 })
      .exec();

    res.status(200).json({
      success: true,
      count: books.length,
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Update stock
exports.updateStock = async (req, res, next) => {
  try {
    const { stock } = req.body;

    if (stock === undefined || stock < 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid stock quantity',
      });
    }

    const book = await Book.findById(req.params.id).exec();
    if (!book) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    await Book.updateOne(
      { _id: req.params.id },
      { $set: { stock, updatedAt: new Date() } }
    );

    res.status(200).json({
      success: true,
      data: { ...book, stock },
    });
  } catch (error) {
    next(error);
  }
};

// Get sales report
exports.getSalesReport = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const filter = { status: { $ne: 'cancelled' } };
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter).exec();

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    // Daily breakdown
    const dailySales = {};
    orders.forEach(order => {
      const date = order.createdAt.toISOString().split('T')[0];
      dailySales[date] = {
        orders: (dailySales[date]?.orders || 0) + 1,
        revenue: (dailySales[date]?.revenue || 0) + (order.totalAmount || 0),
      };
    });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalSales: Math.round(totalSales * 100) / 100,
          totalOrders,
          avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        },
        dailyBreakdown: Object.entries(dailySales).map(([date, data]) => ({
          date,
          ...data,
          revenue: Math.round(data.revenue * 100) / 100,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get inventory report
exports.getInventoryReport = async (req, res, next) => {
  try {
    const books = await Book.find({}).exec();

    const totalBooks = books.length;
    const totalStock = books.reduce((sum, book) => sum + (book.stock || 0), 0);
    const totalValue = books.reduce((sum, book) =>
      sum + ((book.stock || 0) * (book.priceUSD || 0)), 0
    );

    const lowStockItems = books.filter(book => (book.stock || 0) <= 10).length;
    const outOfStock = books.filter(book => (book.stock || 0) === 0).length;

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalBooks,
          totalStock,
          totalValue: Math.round(totalValue * 100) / 100,
          lowStockItems,
          outOfStock,
        },
        books: books.map(book => ({
          _id: book._id,
          title: book.title,
          stock: book.stock,
          priceUSD: book.priceUSD,
          stockValue: Math.round((book.stock || 0) * (book.priceUSD || 0) * 100) / 100,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};
