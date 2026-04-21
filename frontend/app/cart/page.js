/**
 * Shopping Cart Page
 */

'use client';

import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const { token } = useAuthStore();
  const router = useRouter();

  const shippingCost = total > 50 ? 0 : 5;
  const tax = total * 0.1;
  const grandTotal = total + shippingCost + tax;

  const handleCheckout = () => {
    if (!token) {
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <ShoppingBag className="w-20 h-20 mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">Your cart is empty</h1>
          <p className="text-gray-600 text-lg">
            Add some books to get started!
          </p>
          <Link
            href="/books"
            className="inline-block px-8 py-3 gradient-btn text-white rounded-lg font-bold hover:shadow-lg smooth-transition"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold gradient-text mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-4 flex gap-4"
            >
              {/* Image */}
              <Image
                src={item.coverImage}
                alt={item.title}
                width={100}
                height={150}
                className="w-24 h-32 object-cover rounded-lg"
              />

              {/* Details */}
              <div className="flex-1 space-y-2">
                <Link href={`/books/${item._id}`}>
                  <h3 className="font-bold text-lg hover:text-purple-600 smooth-transition">
                    {item.title}
                  </h3>
                </Link>
                <p className="text-gray-600">{item.author}</p>
                <p className="font-bold text-purple-600">
                  {formatPrice(item.priceUSD)}
                </p>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity - 1)
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="font-bold w-8 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQuantity(item._id, item.quantity + 1)
                  }
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  {formatPrice(
                    item.priceUSD * item.quantity
                  )}
                </p>
                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded mt-2 smooth-transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 h-fit sticky top-32 space-y-6"
        >
          <h2 className="text-2xl font-bold">Order Summary</h2>

          <div className="space-y-3 border-b border-gray-200 pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Shipping {total > 50 && '(FREE)'}</span>
              <span className="font-bold">{formatPrice(shippingCost)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span className="font-bold">{formatPrice(tax)}</span>
            </div>
          </div>

          <div className="flex justify-between text-xl font-bold">
            <span>Total</span>
            <span className="gradient-text">{formatPrice(grandTotal)}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full py-3 gradient-btn text-white rounded-lg font-bold hover:shadow-lg smooth-transition"
          >
            Proceed to Checkout
          </button>

          <Link
            href="/books"
            className="block text-center text-purple-600 font-bold hover:text-purple-700 smooth-transition"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
