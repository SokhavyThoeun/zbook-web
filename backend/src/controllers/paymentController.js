/**
 * Payment Controller
 * Handles payment processing and order management
 */

const Order = require('../models/Order');
const Book = require('../models/Book');
const Coupon = require('../models/Coupon');

// Create payment intent (simulated Stripe)
exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid amount',
      });
    }

    // In a real implementation, this would create a Stripe PaymentIntent
    // For now, we simulate it with a mock client secret
    const mockClientSecret = `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`;

    res.status(200).json({
      success: true,
      data: {
        clientSecret: mockClientSecret,
        amount,
        currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment and create order
exports.confirmPayment = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order items',
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId).exec();
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book ${item.bookId} not found`,
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }

      const price = book.discountPercent > 0
        ? book.priceUSD * (1 - book.discountPercent / 100)
        : book.priceUSD;

      subtotal += price * item.quantity;

      orderItems.push({
        book: book._id,
        title: book.title,
        quantity: item.quantity,
        price: price,
      });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      }).exec();

      if (coupon && new Date() <= new Date(coupon.validUntil)) {
        discountAmount = subtotal * (coupon.discountPercent / 100);

        // Increment coupon usage
        await Coupon.updateOne(
          { _id: coupon._id },
          { $inc: { usedCount: 1 } }
        );
      }
    }

    // Calculate final amount
    const shippingCost = subtotal >= 50 ? 0 : 5;
    const totalAmount = subtotal - discountAmount + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus: 'completed',
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      shippingCost,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'processing',
      couponCode: couponCode?.toUpperCase(),
    });

    // Update book stock
    for (const item of items) {
      await Book.updateOne(
        { _id: item.bookId },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Create cash on delivery order
exports.createCashOnDeliveryOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({
        success: false,
        message: 'Please provide order items',
      });
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const book = await Book.findById(item.bookId).exec();
      if (!book) {
        return res.status(404).json({
          success: false,
          message: `Book ${item.bookId} not found`,
        });
      }

      if (book.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for "${book.title}". Available: ${book.stock}`,
        });
      }

      const price = book.discountPercent > 0
        ? book.priceUSD * (1 - book.discountPercent / 100)
        : book.priceUSD;

      subtotal += price * item.quantity;

      orderItems.push({
        book: book._id,
        title: book.title,
        quantity: item.quantity,
        price: price,
      });
    }

    // Apply coupon if provided
    let discountAmount = 0;
    if (couponCode) {
      const coupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
      }).exec();

      if (coupon && new Date() <= new Date(coupon.validUntil)) {
        discountAmount = subtotal * (coupon.discountPercent / 100);

        await Coupon.updateOne(
          { _id: coupon._id },
          { $inc: { usedCount: 1 } }
        );
      }
    }

    const shippingCost = subtotal >= 50 ? 0 : 5;
    const totalAmount = subtotal - discountAmount + shippingCost;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod: 'cash_on_delivery',
      paymentStatus: 'pending',
      subtotal: Math.round(subtotal * 100) / 100,
      discountAmount: Math.round(discountAmount * 100) / 100,
      shippingCost,
      totalAmount: Math.round(totalAmount * 100) / 100,
      status: 'pending',
      couponCode: couponCode?.toUpperCase(),
    });

    // Update book stock
    for (const item of items) {
      await Book.updateOne(
        { _id: item.bookId },
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get payment history
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Order.countDocuments({ user: req.user._id }).exec();

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

// Get payment by ID
exports.getPaymentById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).exec();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};
