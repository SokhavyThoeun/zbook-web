/**
 * Wishlist Page
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function WishlistPage() {
  const { token } = useAuthStore();
  const { addItem } = useCartStore();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchWishlist = async () => {
      try {
        const response = await wishlistAPI.getWishlist();
        setWishlist(response.data.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [token]);

  const handleRemove = async (bookId) => {
    try {
      await wishlistAPI.removeFromWishlist(bookId);
      setWishlist(wishlist.filter((item) => item.bookId._id !== bookId));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  if (!token) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center space-y-6">
          <Heart className="w-20 h-20 mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">
            Please login to view wishlist
          </h1>
          <Link
            href="/login"
            className="inline-block px-8 py-3 gradient-btn text-white rounded-lg font-bold hover:shadow-lg smooth-transition"
          >
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20">
        <Link href="/books" className="flex items-center gap-2 text-purple-600 font-bold mb-8">
          <ArrowLeft className="w-5 h-5" />
          Back to books
        </Link>
        <div className="text-center space-y-6">
          <Heart className="w-20 h-20 mx-auto text-gray-300" />
          <h1 className="text-3xl font-bold text-gray-900">
            Your wishlist is empty
          </h1>
          <p className="text-gray-600">
            Add books to your wishlist to save them for later
          </p>
          <Link
            href="/books"
            className="inline-block px-8 py-3 gradient-btn text-white rounded-lg font-bold hover:shadow-lg smooth-transition"
          >
            Browse Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <Link href="/books" className="flex items-center gap-2 text-purple-600 font-bold mb-8">
        <ArrowLeft className="w-5 h-5" />
        Back to books
      </Link>

      <h1 className="text-4xl font-bold gradient-text mb-8">
        My Wishlist ({wishlist.length})
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((item) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden group hover:shadow-2xl smooth-transition"
          >
            <div className="relative h-64 overflow-hidden bg-gray-300">
              <Image
                src={item.bookId.coverImage}
                alt={item.bookId.title}
                width={300}
                height={400}
                className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
              />
            </div>

            <div className="p-4 space-y-3">
              <Link href={`/books/${item.bookId._id}`}>
                <h3 className="font-bold line-clamp-2 hover:text-purple-600 smooth-transition">
                  {item.bookId.title}
                </h3>
              </Link>

              <p className="text-sm text-gray-600">{item.bookId.author}</p>

              <p className="font-bold text-purple-600">
                {formatPrice(item.bookId.priceUSD)}
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => addItem(item.bookId)}
                  className="flex-1 py-2 gradient-btn text-white rounded-lg font-bold text-sm hover:shadow-lg smooth-transition flex items-center justify-center gap-1"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </button>

                <button
                  onClick={() => handleRemove(item.bookId._id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg smooth-transition"
                >
                  <Heart className="w-5 h-5 fill-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
