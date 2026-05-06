/**
 * Order Detail Page
 * Shows order summary, payment, shipping, and status actions
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Clock, Package, Truck, XCircle } from 'lucide-react';
import { orderAPI } from '@/lib/api';
import { formatDate, formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';

const paymentLabels = {
  'cash-on-delivery': 'Cash on Delivery',
  'bank-transfer': 'Bank Transfer',
  'mobile-money': 'Mobile Money',
  'credit-card': 'Credit Card',
  'aba-qr': 'ABA KHQR',
  'acleda-qr': 'ACLEDA QR',
};

const statusSteps = [
  { id: 'pending', label: 'Order Placed', icon: Clock },
  { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { id: 'shipped', label: 'Shipped', icon: Truck },
  { id: 'delivered', label: 'Delivered', icon: Package },
];

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token, init } = useAuthStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const fetchOrder = async () => {
      const storedToken = token || (typeof window !== 'undefined' ? localStorage.getItem('token') : null);
      if (!storedToken || !id) {
        setLoading(false);
        return;
      }

      try {
        setError('');
        // Use the trackOrder API for richer status/timeline info
        const response = await orderAPI.trackOrder(id);
        setOrder(response.data.data);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Could not load this order.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, token]);

  const handleCancel = async () => {
    setCancelling(true);
    setError('');

    try {
      const response = await orderAPI.cancelOrder(id);
      setOrder(response.data.data);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not cancel this order.');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-300" />
          <div className="h-40 rounded-xl bg-gray-300" />
          <div className="h-72 rounded-xl bg-gray-300" />
        </div>
      </div>
    );
  }

  if (!token && typeof window !== 'undefined' && !localStorage.getItem('token')) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <Package className="mx-auto mb-4 h-16 w-16 text-gray-300" />
        <h1 className="mb-4 text-3xl font-bold text-gray-900">Login required</h1>
        <button onClick={() => router.push('/login')} className="rounded-lg px-8 py-3 font-bold text-white gradient-btn">
          Login
        </button>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <XCircle className="mx-auto mb-4 h-16 w-16 text-red-400" />
        <h1 className="mb-3 text-3xl font-bold text-gray-900">Order unavailable</h1>
        <p className="mb-8 text-gray-600">{error}</p>
        <Link href="/orders" className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-bold text-white gradient-btn">
          <ArrowLeft className="h-5 w-5" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStep = statusSteps.findIndex((step) => step.id === order.status);
  const activeStep = currentStep === -1 ? 0 : currentStep;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/orders" className="mb-8 inline-flex items-center gap-2 font-bold text-purple-600 hover:text-purple-700">
        <ArrowLeft className="h-5 w-5" />
        Back to Orders
      </Link>

      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-purple-600">Order Detail</p>
          <h1 className="text-4xl font-bold gradient-text">{order.orderNumber || `Order ${order._id}`}</h1>
          <p className="mt-2 text-gray-600">Placed {formatDate(order.createdAt)}</p>
        </div>

        {order.status === 'pending' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="rounded-lg border border-red-200 px-5 py-3 font-bold text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            {cancelling ? 'Cancelling...' : 'Cancel Order'}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      <div className="mb-8 rounded-xl bg-white p-6 shadow-lg">
        <div className="grid gap-4 md:grid-cols-4">
          {statusSteps.map((step, index) => {
            const Icon = step.icon;
            const complete = order.status === 'cancelled' ? false : index <= activeStep;

            return (
              <div key={step.id} className={`rounded-lg border p-4 ${complete ? 'border-purple-200 bg-purple-50' : 'border-gray-200 bg-gray-50'}`}>
                <Icon className={`mb-3 h-6 w-6 ${complete ? 'text-purple-600' : 'text-gray-400'}`} />
                <p className={`font-bold ${complete ? 'text-purple-700' : 'text-gray-500'}`}>{step.label}</p>
              </div>
            );
          })}
        </div>
        {order.status === 'cancelled' && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 font-bold text-red-700">This order was cancelled.</p>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="space-y-4">
          {order.items.map((item) => {
            const book = item.bookId && typeof item.bookId === 'object' ? item.bookId : null;

            return (
              <div key={`${item.bookId?._id || item.bookId}-${item.quantity}`} className="flex gap-4 rounded-xl bg-white p-4 shadow-lg">
                {book?.coverImage && (
                  <Image
                    src={book.coverImage}
                    alt={item.bookTitle}
                    width={90}
                    height={130}
                    className="h-32 w-24 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-gray-900">{item.bookTitle}</h2>
                  {book?.author && <p className="text-sm text-gray-600">by {book.author}</p>}
                  <p className="mt-3 text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="font-bold text-purple-600">{formatPrice(item.totalPrice)}</p>
              </div>
            );
          })}
        </section>

        <aside className="space-y-6">
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Payment</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Method</span>
                <span className="font-bold">{paymentLabels[order.paymentMethod] || order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="font-bold capitalize">{order.paymentStatus}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{formatPrice(order.subtotal)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-bold">{formatPrice(order.shippingCost)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-bold">{formatPrice(order.tax)}</span></div>
              <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="gradient-text">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-xl font-bold text-gray-900">Delivery</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>{order.shippingAddress?.street}</p>
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.country}</p>
              <p className="font-semibold text-gray-900">{order.shippingPhone}</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
