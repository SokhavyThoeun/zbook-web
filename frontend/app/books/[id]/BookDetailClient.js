/**
 * Book Detail Client Component
 * Contains all the client-side logic and UI
 */

'use client';

import { useEffect, useState } from 'react';
import { Star, Heart, ShoppingCart, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { bookAPI, reviewAPI, wishlistAPI } from '@/lib/api';
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils';

export default function BookDetailClient({ id }) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { token, init } = useAuthStore();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [bookData, reviewsData, recsData] = await Promise.all([
          bookAPI.getBookById(id),
          reviewAPI.getBookReviews(id),
          bookAPI.getRecommendations(id),
        ]);

        setBook(bookData.data.data);
        setReviews(reviewsData.data.data.reviews);
        setRecommendations(recsData.data.data);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const checkWishlist = async () => {
      if (!token || !id) return;
      try {
        const response = await wishlistAPI.checkWishlist(id);
        setIsWishlisted(Boolean(response.data.data.isInWishlist));
      } catch (error) {
        console.error('Wishlist check error:', error);
      }
    };

    checkWishlist();
  }, [id, token]);

  const showNotice = (message) => {
    setNotice(message);
    setTimeout(() => setNotice(''), 2000);
  };

  const handleWishlistToggle = async () => {
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      if (isWishlisted) {
        await wishlistAPI.removeFromWishlist(id);
        setIsWishlisted(false);
        showNotice('Removed from wishlist');
      } else {
        await wishlistAPI.addToWishlist(id);
        setIsWishlisted(true);
        showNotice('Added to wishlist');
      }
    } catch (error) {
      showNotice(error.response?.data?.message || 'Wishlist update failed');
    }
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: book.title, text: `Check out ${book.title} on Z Book`, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showNotice('Book link copied');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-96 bg-gray-300 rounded-lg" />
          <div className="h-8 bg-gray-300 rounded w-1/3" />
          <div className="h-6 bg-gray-300 rounded w-1/4" />
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-gray-500 text-lg">Book not found</p>
        <Link href="/books" className="text-purple-600 font-bold mt-4 inline-block">
          Back to books
        </Link>
      </div>
    );
  }

  const discountedPrice = calculateDiscount(book.priceUSD, book.discountPercent);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
      {/* Back Button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700"
      >
        <ChevronLeft className="w-5 h-5" />
        Back to books
      </Link>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-1"
        >
          <Image
            src={book.coverImage}
            alt={book.title}
            width={300}
            height={400}
            className="w-full rounded-lg shadow-xl"
          />
        </motion.div>

        {/* Book Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="col-span-2 space-y-6"
        >
          {/* Category Badge */}
          <p className="text-xs font-semibold text-purple-600 uppercase">
            {book.category}
          </p>

          {/* Title */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {book.title}
            </h1>
            <p className="text-xl text-gray-600">by {book.author}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(book.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-gray-700">
              {book.averageRating} ({book.totalReviews} reviews)
            </span>
          </div>

          {/* Price Section */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-lg space-y-2">
            <div className="flex items-center gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Price in USD</p>
                <p className="text-3xl font-bold text-purple-600">
                  {formatPrice(discountedPrice)}
                </p>
                {book.discountPercent > 0 && (
                  <p className="text-sm text-gray-500 line-through mt-1">
                    {formatPrice(book.priceUSD)}
                  </p>
                )}
              </div>
              {book.discountPercent > 0 && (
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  -{book.discountPercent}%
                </div>
              )}
            </div>
            <div className="border-t border-gray-300 pt-2">
              <p className="text-sm text-gray-600 mb-1">Price in KHR</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatPrice(book.priceKHR, 'KHR')}
              </p>
            </div>
          </div>

          {/* Stock Status */}
          <p
            className={`font-bold text-lg ${
              book.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {book.stock > 0
              ? `✓ ${book.stock} in stock`
              : '✗ Out of stock'}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => addItem(book)}
              disabled={book.stock === 0}
              className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 smooth-transition ${
                book.stock > 0
                  ? 'gradient-btn text-white hover:shadow-lg'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-6 h-6" />
              {book.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleWishlistToggle}
              className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-bold hover:bg-purple-50 smooth-transition flex items-center justify-center gap-2"
            >
              <Heart
                className={`w-6 h-6 ${
                  isWishlisted ? 'fill-red-500' : ''
                }`}
              />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>

            <button
              onClick={handleShare}
              className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 smooth-transition flex items-center justify-center gap-2"
              aria-label="Share book"
            >
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          {notice && (
            <div className="rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white">
              {notice}
            </div>
          )}

          {/* Book Details */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 grid grid-cols-2 gap-4">
            {book.publisher && (
              <div>
                <p className="text-xs text-gray-600 font-bold">PUBLISHER</p>
                <p className="text-sm font-medium">{book.publisher}</p>
              </div>
            )}
            {book.pages && (
              <div>
                <p className="text-xs text-gray-600 font-bold">PAGES</p>
                <p className="text-sm font-medium">{book.pages}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-gray-600 font-bold">LANGUAGE</p>
              <p className="text-sm font-medium">{book.language}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 font-bold">FORMAT</p>
              <p className="text-sm font-medium capitalize">{book.format}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-4 gradient-text">About This Book</h2>
        <p className="text-gray-600 leading-relaxed text-lg">
          {book.description}
        </p>
      </motion.div>

      {/* Reviews Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg p-8 shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">
          Reviews ({reviews.length})
        </h2>

        {reviews.length > 0 ? (
          <div className="space-y-4">
            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{review.title}</span>
                  </div>
                  {review.isVerifiedPurchase && (
                    <span className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded font-bold">
                      Verified Purchase
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{review.comment}</p>
                <p className="text-xs text-gray-500">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No reviews yet. Be the first to review!
          </p>
        )}
      </motion.div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold gradient-text">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendations.slice(0, 4).map((book) => (
              <Link
                key={book._id}
                href={`/books/${book._id}`}
                className="group"
              >
                <div className="relative h-48 overflow-hidden rounded-lg bg-gray-300 mb-3">
                  <Image
                    src={book.coverImage}
                    alt={book.title}
                    width={200}
                    height={280}
                    className="w-full h-full object-cover group-hover:scale-110 smooth-transition"
                  />
                </div>
                <h3 className="font-bold line-clamp-2 group-hover:text-purple-600 smooth-transition">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
