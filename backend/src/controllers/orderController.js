/**
 * Order Controller
 * Handles order creation and order tracking
 */

const Order = require('../models/Order');
const Book = require('../models/Book');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Create a new order
 * POST /api/orders
 */
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, shippingPhone, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return sendError(res, 400, 'Cart is empty');
    }

    // Validate items and calculate totals
    let subtotal = 0;
    const orderItems = [];
    let totalQuantity = 0;

    for (const item of items) {
      const book = await Book.findById(item.bookId);

      if (!book) {
        return sendError(res, 400, `Book not found: ${item.bookId}`);
      }

      if (book.stock < item.quantity) {
        return sendError(res, 400, `Insufficient stock for ${book.title}`);
      }

      const itemTotal = book.priceUSD * item.quantity;
      subtotal += itemTotal;
      totalQuantity += item.quantity;

      orderItems.push({
        bookId: item.bookId,
        bookTitle: book.title,
        quantity: item.quantity,
        pricePerUnit: book.priceUSD,
        totalPrice: itemTotal,
      });

      // Reduce stock
      book.stock -= item.quantity;
      await book.save();
    }

    // Calculate totals
    const shippingCost = subtotal > 50 ? 0 : 5; // Free shipping over $50
    const tax = subtotal * 0.1; // 10% tax
    const totalAmount = subtotal + shippingCost + tax;

    // Create order
    const order = new Order({
      userId: req.userId,
      items: orderItems,
      totalQuantity,
      subtotal,
      shippingCost,
      tax,
      totalAmount,
      shippingAddress,
      shippingPhone,
      paymentMethod: paymentMethod || 'cash-on-delivery',
    });

    await order.save();

    // Populate user and book details
    await order.populate('userId items.bookId');

    sendSuccess(res, 201, 'Order created successfully', order);
  } catch (error) {
    console.error('Create order error:', error);
    sendError(res, 500, 'Error creating order');
  }
};

/**
 * Get all orders for the current user
 * GET /api/orders
 */
const getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (page - 1) * limit;

    let filter = { userId: req.userId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt')
      .populate('items.bookId');

    const total = await Order.countDocuments(filter);

    sendSuccess(res, 200, 'Orders retrieved successfully', {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    sendError(res, 500, 'Error retrieving orders');
  }
};

/**
 * Get order by ID
 * GET /api/orders/:id
 */
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate('userId')
      .populate('items.bookId');

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Verify ownership
    if (order.userId._id.toString() !== req.userId) {
      return sendError(res, 403, 'Unauthorized to view this order');
    }

    sendSuccess(res, 200, 'Order retrieved successfully', order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    sendError(res, 500, 'Error retrieving order');
  }
};

/**
 * Track order
 * GET /api/orders/:id/track
 */
const trackOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).select(
      'orderNumber status paymentStatus trackingNumber estimatedDelivery actualDelivery items'
    );

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    // Verify ownership
    if (order.userId.toString() !== req.userId) {
      return sendError(res, 403, 'Unauthorized');
    }

    const trackingInfo = {
      orderNumber: order.orderNumber,
      status: order.status,
      paymentStatus: order.paymentStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      actualDelivery: order.actualDelivery,
      timeline: getOrderTimeline(order.status),
    };

    sendSuccess(res, 200, 'Order tracking info', trackingInfo);
  } catch (error) {
    console.error('Track order error:', error);
    sendError(res, 500, 'Error tracking order');
  }
};

/**
 * Cancel order (only if pending)
 * POST /api/orders/:id/cancel
 */
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return sendError(res, 404, 'Order not found');
    }

    if (order.userId.toString() !== req.userId) {
      return sendError(res, 403, 'Unauthorized');
    }

    if (order.status !== 'pending') {
      return sendError(res, 400, 'Order cannot be cancelled');
    }

    // Restore stock
    for (const item of order.items) {
      const book = await Book.findById(item.bookId);
      if (book) {
        book.stock += item.quantity;
        await book.save();
      }
    }

    order.status = 'cancelled';
    order.paymentStatus = 'refunded';
    await order.save();

    sendSuccess(res, 200, 'Order cancelled successfully', order);
  } catch (error) {
    console.error('Cancel order error:', error);
    sendError(res, 500, 'Error cancelling order');
  }
};

/**
 * Helper function to get order timeline
 */
const getOrderTimeline = (status) => {
  const timeline = {
    pending: ['Order Placed'],
    confirmed: ['Order Placed', 'Confirmed'],
    shipped: ['Order Placed', 'Confirmed', 'Shipped'],
    delivered: ['Order Placed', 'Confirmed', 'Shipped', 'Delivered'],
    cancelled: ['Order Placed', 'Cancelled'],
  };
  return timeline[status] || [];
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  trackOrder,
  cancelOrder,
};
