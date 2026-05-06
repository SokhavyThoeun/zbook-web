/**
 * Header Component
 * Sticky navigation bar with search and auth
 */

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Search, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { debounce } from '@/lib/utils';
import { bookAPI } from '@/lib/api';

export default function Header() {
  const router = useRouter();
  const { user, logout, token } = useAuthStore();
  const { items } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    useAuthStore.getState().init();
  }, []);

  // Search with debounce
  const handleSearch = debounce(async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await bookAPI.searchSuggestions(query);
      setSuggestions(response.data.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  }, 300);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
    handleSearch(e.target.value);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/books?search=${encodeURIComponent(query)}`);
      setShowSuggestions(false);
      setIsMenuOpen(false);
    } else {
      router.push('/books');
      setIsMenuOpen(false);
    }
  };

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 glass-effect border-b border-white/10 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 gradient-btn rounded-lg flex items-center justify-center text-white font-bold text-xl">
              Z
            </div>
            <span className="hidden sm:inline font-bold text-lg gradient-text">
              Z Book
            </span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-md relative">
            <div className="relative w-full">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 smooth-transition"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-purple-100 max-h-64 overflow-y-auto">
                  {suggestions.map((book) => (
                    <Link
                      key={book._id}
                      href={`/books/${book._id}`}
                      onClick={() => {
                        setSearchQuery('');
                        setShowSuggestions(false);
                      }}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 smooth-transition"
                    >
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="w-10 h-14 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{book.title}</p>
                        <p className="text-xs text-gray-500 truncate">{book.author}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-semibold text-gray-700">
            <Link href="/books" className="hover:text-purple-600 smooth-transition">Books</Link>
            <Link href="/categories" className="hover:text-purple-600 smooth-transition">Categories</Link>
            <Link href="/orders" className="hover:text-purple-600 smooth-transition">Orders</Link>
          </nav>

          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            {/* Wishlist */}
            <Link href="/wishlist" className="relative group">
              <Heart className="w-6 h-6 text-gray-700 group-hover:text-red-500 smooth-transition" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-purple-600 smooth-transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Links */}
            {!token ? (
              <>
                <Link
                  href="/login"
                  className="hidden sm:inline px-4 py-2 text-purple-600 font-medium hover:text-purple-700 smooth-transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="hidden sm:inline px-4 py-2 gradient-btn text-white rounded-lg font-medium smooth-transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/profile" className="text-gray-700 hover:text-purple-600 smooth-transition">
                  {user?.username}
                </Link>
                <button
                  onClick={logout}
                  className="p-2 hover:bg-red-50 rounded-lg smooth-transition"
                >
                  <LogOut className="w-5 h-5 text-red-500" />
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-purple-100 rounded-lg smooth-transition"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/20 space-y-3">
            <form onSubmit={submitSearch} className="flex gap-2">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="flex-1 px-3 py-2 rounded-lg bg-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </form>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/books" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-center rounded-lg bg-white/50 font-medium text-gray-700">
                Books
              </Link>
              <Link href="/categories" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-center rounded-lg bg-white/50 font-medium text-gray-700">
                Categories
              </Link>
              <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-center rounded-lg bg-white/50 font-medium text-gray-700">
                Wishlist
              </Link>
              <Link href="/orders" onClick={() => setIsMenuOpen(false)} className="px-4 py-2 text-center rounded-lg bg-white/50 font-medium text-gray-700">
                Orders
              </Link>
            </div>
            {!token ? (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 px-4 py-2 text-center text-purple-600 font-medium border border-purple-600 rounded-lg hover:bg-purple-50 smooth-transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 px-4 py-2 text-center gradient-btn text-white rounded-lg font-medium smooth-transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/profile"
                  className="flex-1 px-4 py-2 text-center text-purple-600 font-medium border border-purple-600 rounded-lg hover:bg-purple-50 smooth-transition"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="flex-1 px-4 py-2 text-center text-red-600 font-medium border border-red-200 rounded-lg hover:bg-red-50 smooth-transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
