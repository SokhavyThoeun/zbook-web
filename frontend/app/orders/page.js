/**
 * User Orders Page
 * Shows user's order history
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { orderAPI } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';

export default function OrdersPage() {
  const { token, init } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getUserOrders(1, 10);
        setOrders(response.data.data.orders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Please login to view orders</h1>
        <Link
          href="/login"
          className="inline-block px-8 py-3 gradient-btn text-white rounded-lg font-bold"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-20 h-20 mx-auto text-gray-300 mb-4" />
        <h1 className="text-3xl font-bold mb-2">No orders yet</h1>
        <p className="text-gray-600 mb-8">
          Start shopping and your orders will appear here
        </p>
        <Link
          href="/books"
          className="inline-block px-8 py-3 gradient-btn text-white rounded-lg font-bold"
        >
          Browse Books
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold gradient-text mb-8">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl smooth-transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Order Number</p>
                <p className="font-bold text-lg">{order.orderNumber}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-bold">{formatDate(order.createdAt)}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-bold capitalize px-3 py-1 rounded-full inline-block ${
                  order.status === 'delivered'
                    ? 'bg-green-100 text-green-700'
                    : order.status === 'shipped'
                    ? 'bg-blue-100 text-blue-700'
                    : order.status === 'cancelled'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.status}
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Total</p>
                <p className="font-bold text-lg text-purple-600">
                  {formatPrice(order.totalAmount)}
                </p>
              </div>

              <Link
                href={`/orders/${order._id}`}
                className="flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700"
              >
                View Details
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
