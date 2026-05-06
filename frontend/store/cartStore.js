/**
 * Cart Store (Zustand)
 * Manages shopping cart state
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,

      // Add item to cart
      addItem: (book) => {
        const items = get().items;
        const existingItem = items.find((item) => item._id === book._id);

        if (existingItem) {
          set({
            items: items.map((item) =>
              item._id === book._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...book, quantity: 1 }] });
        }
        get().calculateTotal();
      },

      // Remove item from cart
      removeItem: (bookId) => {
        set({ items: get().items.filter((item) => item._id !== bookId) });
        get().calculateTotal();
      },

      // Update item quantity
      updateQuantity: (bookId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(bookId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item._id === bookId ? { ...item, quantity } : item
          ),
        });
        get().calculateTotal();
      },

      // Clear cart
      clearCart: () => {
        set({ items: [], total: 0 });
      },

      // Calculate total
      calculateTotal: () => {
        const total = get().items.reduce(
          (sum, item) => sum + item.priceUSD * item.quantity,
          0
        );
        set({ total });
      },

      // Get item count
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'zbook-cart',
      partialize: (state) => ({ items: state.items, total: state.total }),
    }
  )
);
