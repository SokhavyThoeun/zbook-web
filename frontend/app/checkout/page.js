/**
 * Checkout Page
 * Order confirmation and shipping details
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Banknote, CheckCircle, CreditCard, Landmark, QrCode, Smartphone } from 'lucide-react';

const paymentMethods = [
  {
    id: 'cash-on-delivery',
    name: 'Cash on Delivery',
    description: 'Pay with cash when your books arrive.',
    icon: Banknote,
  },
  {
    id: 'aba-qr',
    name: 'ABA KHQR',
    description: 'Scan the ABA QR code and confirm before delivery.',
    icon: QrCode,
    qrLabel: 'ABA',
    account: 'Z Book Store - 000 123 456',
  },
  {
    id: 'acleda-qr',
    name: 'ACLEDA QR',
    description: 'Scan with ACLEDA mobile banking and send the receipt.',
    icon: QrCode,
    qrLabel: 'ACLEDA',
    account: 'Z Book Store - 000 987 654',
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    description: 'Transfer to Z Book and keep your transaction reference.',
    icon: Landmark,
    account: 'Z Book Store - Phnom Penh Branch',
  },
  {
    id: 'mobile-money',
    name: 'Mobile Money',
    description: 'Pay by wallet and share the reference number.',
    icon: Smartphone,
  },
  {
    id: 'credit-card',
    name: 'Credit Card',
    description: 'Card payment request is recorded for manual confirmation.',
    icon: CreditCard,
  },
];

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore();
  const { user, token, init } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    shippingAddress: user?.address || '',
    shippingPhone: user?.phoneNumber || '',
    paymentMethod: 'cash-on-delivery',
    paymentReference: '',
  });

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (user) {
      setFormData((current) => ({
        ...current,
        shippingAddress: current.shippingAddress || user.address || '',
        shippingPhone: current.shippingPhone || user.phoneNumber || '',
      }));
    }
  }, [user]);

  const shippingCost = total > 50 ? 0 : 5;
  const tax = total * 0.1;
  const grandTotal = total + shippingCost + tax;
  const selectedPayment = paymentMethods.find((method) => method.id === formData.paymentMethod) || paymentMethods[0];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      router.push('/books');
      return;
    }

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
        notes: formData.paymentReference
          ? `Payment reference: ${formData.paymentReference}`
          : undefined,
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
      setError(error.response?.data?.message || 'Could not place order. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!token && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Login required</h1>
        <p className="text-gray-600 mb-8">Please login before checkout so we can save your order.</p>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-3 gradient-btn text-white rounded-lg font-bold"
        >
          Login
        </button>
      </div>
    );
  }

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
        <p className="text-gray-600 mb-8">Add books before starting checkout.</p>
        <button
          onClick={() => router.push('/books')}
          className="px-8 py-3 gradient-btn text-white rounded-lg font-bold"
        >
          Browse Books
        </button>
      </div>
    );
  }

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

            <div className="grid gap-3 md:grid-cols-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                const active = formData.paymentMethod === method.id;

                return (
                  <label
                    key={method.id}
                    className={`cursor-pointer rounded-lg border p-4 smooth-transition ${
                      active
                        ? 'border-purple-500 bg-purple-50 shadow-md'
                        : 'border-gray-200 hover:border-purple-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={active}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="flex items-start gap-3">
                      <span className={`rounded-lg p-2 ${active ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-bold text-gray-900">{method.name}</span>
                        <span className="mt-1 block text-sm text-gray-600">{method.description}</span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>

            {selectedPayment.qrLabel && (
              <div className="rounded-xl border border-purple-100 bg-purple-50 p-5">
                <div className="grid gap-5 md:grid-cols-[160px_1fr]">
                  <div className="aspect-square rounded-lg bg-white p-4 shadow-inner">
                    <div className="grid h-full w-full grid-cols-5 grid-rows-5 gap-1">
                      {[...Array(25)].map((_, index) => (
                        <div
                          key={index}
                          className={`rounded-sm ${
                            [0, 1, 2, 5, 10, 20, 21, 22, 4, 9, 14, 19, 24, 12, 16, 18].includes(index)
                              ? 'bg-gray-900'
                              : 'bg-purple-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">{selectedPayment.qrLabel} payment</h3>
                    <p className="text-sm text-gray-600">Total to pay: <span className="font-bold text-purple-700">{formatPrice(grandTotal)}</span></p>
                    <p className="text-sm text-gray-600">Account: <span className="font-semibold">{selectedPayment.account}</span></p>
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-gray-700">Transaction reference optional</span>
                      <input
                        name="paymentReference"
                        value={formData.paymentReference}
                        onChange={handleInputChange}
                        placeholder="Example: ABA123456"
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}

            {!selectedPayment.qrLabel && selectedPayment.account && (
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                Transfer account: <span className="font-bold">{selectedPayment.account}</span>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
              {error}
            </div>
          )}

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
