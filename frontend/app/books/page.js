/**
 * Books Listing Page - Enhanced
 * Browse all 700+ books with filters, search, and pagination
 */

'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Grid, List, BookOpen, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import BookCard from '@/components/BookCard';
import { GridSkeleton } from '@/components/Skeleton';
import { bookAPI, categoryAPI } from '@/lib/api';

const CATEGORIES = [
  { id: 'all', name: 'All Books', count: 700 },
  { id: 'fiction', name: 'Fiction', count: 50 },
  { id: 'non-fiction', name: 'Non-Fiction', count: 50 },
  { id: 'science', name: 'Science', count: 50 },
  { id: 'history', name: 'History', count: 50 },
  { id: 'biography', name: 'Biography', count: 50 },
  { id: 'romance', name: 'Romance', count: 50 },
  { id: 'mystery', name: 'Mystery', count: 50 },
  { id: 'self-help', name: 'Self-Help', count: 50 },
  { id: 'technology', name: 'Technology', count: 50 },
  { id: 'business', name: 'Business', count: 50 },
  { id: 'adventure', name: 'Adventure', count: 50 },
  { id: 'young-adult', name: 'Young Adult', count: 50 },
  { id: 'children', name: 'Children', count: 50 },
  { id: 'cambodian', name: 'Cambodian', count: 50 },
];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'priceUSD', label: 'Price: Low to High' },
  { value: '-priceUSD', label: 'Price: High to Low' },
  { value: '-averageRating', label: 'Highest Rated' },
  { value: '-totalReviews', label: 'Most Popular' },
  { value: 'title', label: 'Title: A-Z' },
];

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-createdAt');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState(CATEGORIES);

  const itemsPerPage = 24;

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== 'all') params.set('category', selectedCategory);
    if (searchQuery) params.set('search', searchQuery);
    if (sortBy !== '-createdAt') params.set('sort', sortBy);
    if (currentPage > 1) params.set('page', currentPage.toString());

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedCategory, searchQuery, sortBy, currentPage]);

  // Load categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        if (response.data.data.length > 0) {
          const apiCategories = response.data.data.map(cat => ({
            id: cat.id,
            name: cat.name,
            count: 50,
          }));
          setCategories([{ id: 'all', name: 'All Books', count: 700 }, ...apiCategories]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const category = selectedCategory === 'all' ? '' : selectedCategory;
        const response = await bookAPI.getAllBooks(
          currentPage,
          itemsPerPage,
          category,
          searchQuery
        );

        setBooks(response.data.data.books);
        setTotalPages(response.data.data.pagination.pages);
        setTotalBooks(response.data.data.pagination.total);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, searchQuery, currentPage]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('-createdAt');
    setCurrentPage(1);
  };

  const activeFiltersCount = [
    selectedCategory !== 'all',
    searchQuery !== '',
    sortBy !== '-createdAt',
  ].filter(Boolean).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold gradient-text">Browse Books</h1>
        <p className="text-gray-600">
          Discover <span className="font-bold text-purple-600">{totalBooks}</span> books across {CATEGORIES.length - 1} categories
        </p>
      </div>

      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        >
          <SlidersHorizontal className="w-5 h-5" />
          Filters {activeFiltersCount > 0 && <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">{activeFiltersCount}</span>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters
              </h2>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <X className="w-4 h-4" /> Clear
                </button>
              )}
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Title, author, keyword..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Categories */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Categories
              </label>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm smooth-transition ${
                      selectedCategory === category.id
                        ? 'bg-purple-100 text-purple-700 font-semibold'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{books.length}</span> of{' '}
              <span className="font-semibold">{totalBooks}</span> books
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">View:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Books Display */}
          {loading ? (
            <GridSkeleton count={12} />
          ) : books.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {books.map((book) => (
                <motion.div
                  key={book._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <BookCard book={book} viewMode={viewMode} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-md">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">No books found</p>
              <p className="text-gray-400 text-sm mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Previous
              </button>

              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentPage === pageNum
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <BooksContent />
    </Suspense>
  );
}
