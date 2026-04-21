/**
 * Home Page
 * Landing page with hero section and featured books
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import BookCard from '@/components/BookCard';
import { GridSkeleton } from '@/components/Skeleton';
import { bookAPI } from '@/lib/api';

export default function Home() {
  const [trendingBooks, setTrendingBooks] = useState([]);
  const [newBooks, setNewBooks] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const [trending, newReleases, popular] = await Promise.all([
          bookAPI.getTrendingBooks(),
          bookAPI.getNewBooks(),
          bookAPI.getPopularBooks(),
        ]);

        setTrendingBooks(trending.data.data);
        setNewBooks(newReleases.data.data);
        setPopularBooks(popular.data.data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
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
    <div className="space-y-20 py-10">
      {/* Hero Section */}
      <section className="relative px-4 py-16 md:py-24 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-subtle" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-bounce-subtle" />
        </div>

        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center space-y-6"
          >
            <div className="inline-block px-4 py-2 bg-purple-100 rounded-full text-purple-600 font-semibold text-sm">
              <Sparkles className="inline-block mr-2 w-4 h-4" />
              Welcome to Z Book
            </div>

            <h1 className="text-4xl md:text-6xl font-bold gradient-text leading-tight">
              Discover Your Next Favorite Book
            </h1>

            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Explore trending books, new releases, and classics from around the world.
              Perfect for Gen Z readers who love great stories.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/books"
                className="px-8 py-3 gradient-btn text-white rounded-lg font-bold flex items-center justify-center gap-2 group hover:shadow-lg smooth-transition"
              >
                Browse Books
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
              </Link>

              <Link
                href="/trending"
                className="px-8 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-bold hover:bg-purple-50 smooth-transition"
              >
                See Trending
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trending Books */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold gradient-text">Trending Now 🔥</h2>
            <p className="text-gray-600 text-sm mt-1">
              What everyone's reading this week
            </p>
          </div>
          <Link href="/trending" className="text-purple-600 font-bold flex items-center gap-1 group">
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
          </Link>
        </motion.div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trendingBooks.slice(0, 4).map((book) => (
              <motion.div key={book._id} variants={itemVariants}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* New Releases */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold gradient-text">New Releases ✨</h2>
            <p className="text-gray-600 text-sm mt-1">Fresh titles just added</p>
          </div>
          <Link href="/new" className="text-purple-600 font-bold flex items-center gap-1 group">
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
          </Link>
        </motion.div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {newBooks.slice(0, 4).map((book) => (
              <motion.div key={book._id} variants={itemVariants}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Popular Books */}
      <section className="max-w-7xl mx-auto px-4 space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between"
        >
          <div>
            <h2 className="text-3xl font-bold gradient-text">Popular Picks 👑</h2>
            <p className="text-gray-600 text-sm mt-1">Readers' favorites</p>
          </div>
          <Link href="/popular" className="text-purple-600 font-bold flex items-center gap-1 group">
            View All
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 smooth-transition" />
          </Link>
        </motion.div>

        {loading ? (
          <GridSkeleton count={4} />
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {popularBooks.slice(0, 4).map((book) => (
              <motion.div key={book._id} variants={itemVariants}>
                <BookCard book={book} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 text-white py-16 px-4 rounded-2xl max-w-6xl mx-auto">
        <div className="text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to explore?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of Gen Z book lovers and discover your favorite reads today.
          </p>
          <Link
            href="/books"
            className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg font-bold hover:bg-gray-100 smooth-transition"
          >
            Start Browsing
          </Link>
        </div>
      </section>
    </div>
  );
}
