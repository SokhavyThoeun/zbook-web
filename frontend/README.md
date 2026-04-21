# Z Book - Frontend

Modern bookstore UI built with Next.js, React, and Tailwind CSS for Cambodian Gen Z users.

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js v16+ and npm
- Backend API running (see backend README)

### Installation

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

   Update `.env.local`:
   ```
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
frontend/
├── app/
│   ├── layout.js                # Root layout
│   ├── page.js                  # Home page
│   ├── books/
│   │   ├── page.js              # Books listing
│   │   └── [id]/
│   │       └── page.js          # Book detail
│   ├── cart/
│   │   └── page.js              # Shopping cart
│   ├── checkout/
│   │   └── page.js              # Order checkout
│   ├── login/
│   │   └── page.js              # Login page
│   └── register/
│       └── page.js              # Registration page
├── components/
│   ├── Header.jsx               # Navigation header
│   ├── Footer.jsx               # Footer
│   ├── BookCard.jsx             # Book display card
│   └── Skeleton.jsx             # Loading skeleton
├── store/
│   ├── authStore.js             # Auth state (Zustand)
│   └── cartStore.js             # Cart state (Zustand)
├── lib/
│   ├── api.js                   # API client & endpoints
│   └── utils.js                 # Utility functions
├── styles/
│   └── globals.css              # Global styles
├── public/                       # Static assets
├── package.json
├── next.config.mjs
├── tailwind.config.js
└── .env.local.example
```

## Features

✨ **Homepage** - Hero section with trending, new, and popular books
🔍 **Search** - Live search suggestions for books and authors
📚 **Browse** - Filter books by category with pagination
📖 **Book Details** - Full information, reviews, and recommendations
🛒 **Shopping Cart** - Add/remove items with quantity management
💳 **Checkout** - Shipping and payment method selection
🔐 **Authentication** - User login and registration
❤️ **Wishlist** - Save favorite books (frontend ready)
⭐ **Reviews** - View and filter book reviews
📱 **Responsive** - Mobile-first design with bottom navigation
🎨 **Modern UI** - Gen Z inspired with gradients and animations

## API Integration

All API calls are managed through `/lib/api.js`. Example:

```javascript
import { bookAPI } from '@/lib/api';

// Get all books
const response = await bookAPI.getAllBooks(page, limit, category, search);

// Get book by ID
const book = await bookAPI.getBookById(id);
```

## State Management

Using Zustand for lightweight state management:

```javascript
// Auth Store
const { user, token, login, logout } = useAuthStore();

// Cart Store
const { items, addItem, removeItem, total } = useCartStore();
```

## Styling System

### Color Scheme
- **Primary**: Purple (#7c3aed) to Blue (#3b82f6)
- **Background**: Gradient: Slate → Purple → Blue
- **Accents**: Red (#ef4444), Green (#22c55e), Yellow (#eab308)

### Utility Classes
```css
.gradient-text        /* Gradient text effect */
.gradient-btn        /* Gradient button style */
.glass-effect        /* Glassmorphism background */
.smooth-transition   /* Smooth CSS transitions */
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Vercel

### Option 1: Using Git
1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy!

### Option 2: Using Vercel CLI
```bash
npm i -g vercel
vercel
```

### Environment Variables for Production
```
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.com/api
```

## Performance Optimizations

✅ Image optimization with Next.js Image component
✅ Code splitting and lazy loading
✅ Zustand for lightweight state management
✅ Memoization for expensive computations
✅ Debounced search functionality
✅ CSS classes instead of inline styles

## Best Practices Implemented

✅ Component-based architecture
✅ Custom hooks for logic reuse
✅ Error handling with try-catch
✅ Loading states for async operations
✅ Responsive design with Tailwind
✅ Accessibility considerations
✅ SEO optimization with metadata
✅ Clean code with comments
✅ Consistent naming conventions

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### API Connection Issues
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_BASE_URL` in `.env.local`
- Verify CORS settings in backend

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
lsof -i :3000
kill -9 <PID>
```

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.

---

**Next Steps:**
1. Install dependencies: `npm install`
2. Configure environment: `cp .env.local.example .env.local`
3. Start server: `npm run dev`
4. Visit: http://localhost:3000
