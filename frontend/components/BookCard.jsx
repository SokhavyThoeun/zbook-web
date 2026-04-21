/**
 * Book Card Component
 * Displays individual book in grid
 */

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { formatPrice, calculateDiscount } from '@/lib/utils';
import { motion } from 'framer-motion';

export default function BookCard({ book }) {
  const { addItem } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);

  const discountedPrice = calculateDiscount(book.priceUSD, book.discountPercent);

  const handleAddToCart = () => {
    addItem(book);
    setShowAddedToast(true);
    setTimeout(() => setShowAddedToast(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl smooth-transition group"
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
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute bottom-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 smooth-transition"
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
        {showAddedToast && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
              Added to cart!
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
