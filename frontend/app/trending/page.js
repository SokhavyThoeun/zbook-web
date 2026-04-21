/**
 * Trending Books Page
 * Shows currently trending books
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, ArrowLeft, Flame } from 'lucide-react';
import BookCard from '@/components/BookCard';
import { GridSkeleton } from '@/components/Skeleton';
import { bookAPI } from '@/lib/api';

export default function TrendingPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const response = await bookAPI.getTrendingBooks();
        setBooks(response.data.data);
      } catch (error) {
        console.error('Error fetching trending books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 font-bold hover:text-purple-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold gradient-text">Trending Now</h1>
            <p className="text-gray-600 mt-1">
              The hottest books everyone is reading this week
            </p>
          </div>
        </div>
      </motion.div>

      {/* Books Grid */}
      {loading ? (
        <GridSkeleton count={12} />
      ) : books.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {books.map((book, index) => (
            <motion.div key={book._id} variants={itemVariants}>
              <div className="relative">
                {index < 3 && (
                  <div className="absolute -top-3 -left-3 z-10 bg-gradient-to-r from-yellow-400 to-orange-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                    #{index + 1}
                  </div>
                )}
                <BookCard book={book} />
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <TrendingUp className="w-20 h-20 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No trending books yet
          </h2>
          <p className="text-gray-600">
            Check back soon for trending titles
          </p>
        </div>
      )}
    </div>
  );
}
