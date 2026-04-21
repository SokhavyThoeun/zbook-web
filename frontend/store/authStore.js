/**
 * Authentication Store (Zustand)
 * Manages user authentication state
 */

import { create } from 'zustand';
import { axiosInstance } from '@/lib/api';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  isAuthenticated: false,

  // Initialize from localStorage
  init: () => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        set({
          token: storedToken,
          user: JSON.parse(storedUser),
          isAuthenticated: true,
        });
        // Set default auth header
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    }
  },

  // Register user
  register: async (username, email, password, fullName) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/register', {
        username,
        email,
        password,
        fullName,
      });
      const { user, token } = response.data.data;
      set({ user, token, isAuthenticated: true });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message
        || error.message
        || 'Registration failed. Please try again.';
      return { success: false, error: errorMsg };
    } finally {
      set({ isLoading: false });
    }
  },

  // Login user
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      const { user, token } = response.data.data;
      set({ user, token, isAuthenticated: true });
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      const errorMsg = error.response?.data?.message
        || error.message
        || 'Login failed. Please check your credentials.';
      return { success: false, error: errorMsg };
    } finally {
      set({ isLoading: false });
    }
  },

  // Logout user
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axiosInstance.defaults.headers.common['Authorization'];
  },

  // Update profile
  updateProfile: async (profileData) => {
    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      const updatedUser = response.data.data;
      set({ user: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  },
}));
