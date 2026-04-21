/**
 * Checkout Page
 * Order confirmation and shipping details
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    shippingPhone: user?.phoneNumber || '',
    paymentMethod: 'cash-on-delivery',
  });

  const shippingCost = total > 50 ? 0 : 5;
  const tax = total * 0.1;
  const grandTotal = total + shippingCost + tax;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: items.map((item) => ({
          bookId: item._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          street: formData.shippingAddress,
          city: user?.city || 'Phnom Penh',
          country: 'Cambodia',
        },
        shippingPhone: formData.shippingPhone,
        paymentMethod: formData.paymentMethod,
      };

      const response = await orderAPI.createOrder(orderData);

      if (response.data.success) {
        setOrderCreated(true);
        clearCart();
        setTimeout(() => {
          router.push(`/orders/${response.data.data._id}`);
        }, 2000);
      }
    } catch (error) {
      console.error('Order creation error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (orderCreated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
          <h1 className="text-4xl font-bold text-gray-900">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your order has been placed successfully.
            Redirecting to order details...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold gradient-text mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Shipping Details</h2>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Street Address
              </label>
              <textarea
                name="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleInputChange}
                placeholder="Enter your delivery address"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="shippingPhone"
                value={formData.shippingPhone}
                onChange={handleInputChange}
                placeholder="+855 (0) 123 456 789"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
            <h2 className="text-2xl font-bold">Payment Method</h2>

            <div className="space-y-3">
              {['cash-on-delivery', 'bank-transfer', 'mobile-money'].map(
                (method) => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={formData.paymentMethod === method}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600"
                    />
                    <span className="font-medium capitalize">
                      {method.replace('-', ' ')}
                    </span>
                  </label>
                )
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 gradient-btn text-white rounded-lg font-bold hover:shadow-lg smooth-transition disabled:opacity-50"
          >
            {loading ? 'Processing...' : `Place Order - ${formatPrice(grandTotal)}`}
          </button>
        </form>

        {/* Order Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 h-fit space-y-6"
        >
          <h2 className="text-2xl font-bold">Order Summary</h2>

          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item._id} className="flex justify-between text-sm">
                <span>
                  {item.title} × {item.quantity}
                </span>
                <span className="font-bold">
                  {formatPrice(item.priceUSD * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span className="font-bold">{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="font-bold">{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="gradient-text">{formatPrice(grandTotal)}</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
