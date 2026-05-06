/**
 * Categories Page
 * Browse all book categories
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  BookOpen, Newspaper, FlaskConical, Clock, User, Heart, Search,
  TrendingUp, Cpu, Briefcase, Compass, Smile, Baby, Flag,
  ChevronRight, ArrowRight
} from 'lucide-react';
import { categoryAPI } from '@/lib/api';

const iconMap = {
  BookOpen,
  Newspaper,
  Flask: FlaskConical,
  FlaskConical,
  Clock,
  User,
  Heart,
  Search,
  TrendingUp,
  Cpu,
  Briefcase,
  Compass,
  Smile,
  Baby,
  Flag,
};

const categoryColors = {
  fiction: 'from-purple-500 to-pink-500',
  'non-fiction': 'from-blue-500 to-cyan-500',
  science: 'from-green-500 to-emerald-500',
  history: 'from-amber-500 to-orange-500',
  biography: 'from-rose-500 to-red-500',
  romance: 'from-pink-500 to-rose-400',
  mystery: 'from-slate-600 to-slate-800',
  'self-help': 'from-teal-500 to-cyan-500',
  technology: 'from-indigo-500 to-blue-500',
  business: 'from-yellow-500 to-amber-500',
  adventure: 'from-orange-500 to-red-500',
  'young-adult': 'from-violet-500 to-purple-500',
  children: 'from-sky-400 to-blue-400',
  cambodian: 'from-red-600 to-blue-600',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
            Browse by Category
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our collection of over 700 books across 14 categories.
            From fiction to technology, find your perfect read.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || BookOpen;
            const gradient = categoryColors[category.id] || 'from-purple-500 to-pink-500';
            const coverImage = category.coverImage || `https://placehold.co/400x600/667eea/ffffff?text=${encodeURIComponent(category.name)}`;

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
              >
                <Link href={`/books?category=${category.id}`}>
                  <div className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                    {/* Book Cover Header */}
                    <div className={`relative h-44 bg-gradient-to-r ${gradient} overflow-hidden`}>
                      <Image
                        src={coverImage}
                        alt={`${category.name} book cover`}
                        width={400}
                        height={600}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-70`} />
                      <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/90 shadow-md">
                        <Icon className="w-7 h-7 text-purple-700" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-purple-600 font-semibold text-sm">
                        Browse Books
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { value: '700+', label: 'Books Available' },
            { value: '14', label: 'Categories' },
            { value: '50+', label: 'Books per Category' },
            { value: '24/7', label: 'Shopping' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 bg-white rounded-xl shadow-md"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
