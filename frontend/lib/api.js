/**
 * API Client Configuration
 * Axios instance with base URL and interceptors
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
axiosInstance.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * API Methods
 */

// Auth APIs
export const authAPI = {
  register: (data) => axiosInstance.post('/auth/register', data),
  login: (data) => axiosInstance.post('/auth/login', data),
  getProfile: () => axiosInstance.get('/auth/me'),
  updateProfile: (data) => axiosInstance.put('/auth/profile', data),
  changePassword: (data) => axiosInstance.post('/auth/change-password', data),
};

// Book APIs
export const bookAPI = {
  getAllBooks: (page, limit, category, search) =>
    axiosInstance.get('/books', { params: { page, limit, category, search } }),
  getTrendingBooks: () => axiosInstance.get('/books/trending'),
  getNewBooks: () => axiosInstance.get('/books/new'),
  getPopularBooks: () => axiosInstance.get('/books/popular'),
  getBookById: (id) => axiosInstance.get(`/books/${id}`),
  searchSuggestions: (query) =>
    axiosInstance.get('/books/search/suggestions', { params: { query } }),
  getByCategory: (category, page, limit) =>
    axiosInstance.get(`/books/category/${category}`, { params: { page, limit } }),
  getRecommendations: (id) => axiosInstance.get(`/books/${id}/recommendations`),
};

// Order APIs
export const orderAPI = {
  createOrder: (data) => axiosInstance.post('/orders', data),
  getUserOrders: (page, limit, status) =>
    axiosInstance.get('/orders', { params: { page, limit, status } }),
  getOrderById: (id) => axiosInstance.get(`/orders/${id}`),
  trackOrder: (id) => axiosInstance.get(`/orders/${id}/track`),
  cancelOrder: (id) => axiosInstance.post(`/orders/${id}/cancel`),
};

// Wishlist APIs
export const wishlistAPI = {
  getWishlist: () => axiosInstance.get('/wishlist'),
  addToWishlist: (bookId) =>
    axiosInstance.post('/wishlist', { bookId }),
  removeFromWishlist: (bookId) =>
    axiosInstance.delete(`/wishlist/${bookId}`),
  checkWishlist: (bookId) =>
    axiosInstance.get(`/wishlist/check/${bookId}`),
};

// Review APIs
export const reviewAPI = {
  getBookReviews: (bookId, page, limit) =>
    axiosInstance.get(`/reviews/book/${bookId}`, { params: { page, limit } }),
  createReview: (data) => axiosInstance.post('/reviews', data),
  updateReview: (id, data) => axiosInstance.put(`/reviews/${id}`, data),
  deleteReview: (id) => axiosInstance.delete(`/reviews/${id}`),
  markHelpful: (id) => axiosInstance.post(`/reviews/${id}/helpful`),
};

// Category APIs
export const categoryAPI = {
  getAll: () => axiosInstance.get('/categories'),
  getById: (id) => axiosInstance.get(`/categories/${id}`),
  getBooksByCategory: (id, page, limit) =>
    axiosInstance.get(`/categories/${id}/books`, { params: { page, limit } }),
};

// Coupon APIs
export const couponAPI = {
  validate: (code, orderAmount) =>
    axiosInstance.post('/coupons/validate', { code, orderAmount }),
};

// Payment APIs
export const paymentAPI = {
  createIntent: (amount, currency) =>
    axiosInstance.post('/payments/create-intent', { amount, currency }),
  confirmPayment: (data) => axiosInstance.post('/payments/confirm', data),
  createCODOrder: (data) => axiosInstance.post('/payments/cash-on-delivery', data),
  getHistory: (page, limit) =>
    axiosInstance.get('/payments/history', { params: { page, limit } }),
};

// Admin APIs (requires admin role)
export const adminAPI = {
  getStats: () => axiosInstance.get('/admin/stats'),
  getAnalytics: (period) => axiosInstance.get('/admin/analytics', { params: { period } }),
  getUsers: (page, limit) => axiosInstance.get('/admin/users', { params: { page, limit } }),
  getOrders: (page, limit, status) =>
    axiosInstance.get('/admin/orders', { params: { page, limit, status } }),
  updateOrderStatus: (id, status) =>
    axiosInstance.put(`/admin/orders/${id}/status`, { status }),
  getInventory: (lowStock) => axiosInstance.get('/admin/inventory', { params: { lowStock } }),
  updateStock: (id, stock) => axiosInstance.put(`/admin/inventory/${id}/stock`, { stock }),
  createBook: (data) => axiosInstance.post('/admin/books', data),
  updateBook: (id, data) => axiosInstance.put(`/admin/books/${id}`, data),
  deleteBook: (id) => axiosInstance.delete(`/admin/books/${id}`),
};
