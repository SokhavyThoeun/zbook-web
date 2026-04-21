/**
 * Utility Functions
 */

/**
 * Format price based on currency
 */
export const formatPrice = (price, currency = 'USD') => {
  if (currency === 'KHR') {
    return `${price.toLocaleString()} ៛`;
  }
  return `$${price.toFixed(2)}`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

/**
 * Debounce function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Calculate discount
 */
export const calculateDiscount = (original, discount) => {
  return original - (original * discount) / 100;
};
