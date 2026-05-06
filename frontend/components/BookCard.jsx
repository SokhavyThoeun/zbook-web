/**
 * Book Card Component
 * Displays individual book in grid
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { wishlistAPI } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BookCard({ book, viewMode = 'grid' }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { token, init } = useAuthStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [message, setMessage] = useState('');

  const discountedPrice = calculateDiscount(book.priceUSD, book.discountPercent);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!token || !book?._id) return;

      try {
        const response = await wishlistAPI.checkWishlist(book._id);
        setIsWishlisted(Boolean(response.data.data.isInWishlist));
      } catch (error) {
        console.error('Wishlist check error:', error);
      }
    };

    checkWishlist();
  }, [book?._id, token]);

  const handleAddToCart = () => {
    addItem(book);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(book._id);
        setIsWishlisted(false);
        setMessage('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(book._id);
        setIsWishlisted(true);
        setMessage('Added to wishlist');
      }
      setTimeout(() => setMessage(''), 1800);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Wishlist update failed');
      setTimeout(() => setMessage(''), 2200);
    }
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition"
      >
        <div className="flex flex-col sm:flex-row">
          <Link href={`/books/${book._id}`} className="relative block h-64 sm:h-auto sm:w-40 flex-shrink-0 bg-gradient-to-br from-purple-100 to-blue-100">
            <Image
              src={book.coverImage}
              alt={book.title}
              width={220}
              height={320}
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="flex-1 p-5 space-y-3">
            <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
              {book.category}
            </p>
            <Link href={`/books/${book._id}`}>
              <h3 className="font-bold text-xl hover:text-purple-600 smooth-transition">
                {book.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < Math.round(book.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
              <span className="text-xs text-gray-600 ml-1">({book.totalReviews})</span>
            </div>
          </div>

          <div className="p-5 sm:w-52 flex flex-col justify-between gap-4 border-t sm:border-l sm:border-t-0 border-gray-100">
            <div>
              <p className="text-2xl font-bold text-purple-600">{formatPrice(discountedPrice)}</p>
              {book.discountPercent > 0 && (
                <p className="text-sm text-gray-500 line-through">{formatPrice(book.priceUSD)}</p>
              )}
              <p className={`mt-2 text-xs font-semibold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={book.stock === 0}
                className={`flex-1 py-2 rounded-lg font-bold flex items-center justify-center gap-2 smooth-transition ${
                  book.stock > 0 ? 'gradient-btn text-white hover:shadow-lg' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                Add
              </button>
              <button
                onClick={handleWishlistToggle}
                className="p-2 border border-purple-200 text-purple-600 rounded-lg hover:bg-purple-50 smooth-transition"
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {(showAddedToast || message) && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
            {message || 'Added to cart!'}
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition group"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
        <Image
          src={book.coverImage}
          alt={book.title}
          width={300}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
        />

        {/* Discount Badge */}
        {book.discountPercent > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{book.discountPercent}%
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex gap-2">
          {book.isTrending && (
            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
              Trending
            </span>
          )}
          {book.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
              New
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 smooth-transition"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-5 h-5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
          {book.category}
        </p>

        {/* Title */}
        <Link href={`/books/${book._id}`}>
          <h3 className="font-bold text-lg line-clamp-2 hover:text-purple-600 smooth-transition">
            {book.title}
          </h3>
        </Link>

        {/* Author */}
        <p className="text-sm text-gray-600">{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(book.averageRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-gray-600 ml-1">
            ({book.totalReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-purple-600">
            {formatPrice(discountedPrice)}
          </span>
          {book.discountPercent > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(book.priceUSD)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        <p
          className={`text-xs font-semibold ${
            book.stock > 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {book.stock > 0 ? `${book.stock} in stock` : 'Out of stock'}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={book.stock === 0}
          className={`w-full py-2 rounded-lg font-bold flex items-center justify-center gap-2 smooth-transition ${
            book.stock > 0
              ? 'gradient-btn text-white hover:shadow-lg'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>

        {/* Added Toast */}
        {(showAddedToast || message) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
              {message || 'Added to cart!'}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
