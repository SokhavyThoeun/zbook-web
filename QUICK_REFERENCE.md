# 🎯 Z Book - Quick Reference Guide

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Backend Commands](#backend-commands)
3. [Frontend Commands](#frontend-commands)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)
6. [Features Checklist](#features-checklist)

---

## Quick Start

### One-Command Setup (Mac/Linux)
```bash
bash setup.sh
```

### One-Command Setup (Windows)
```cmd
setup.bat
```

### Manual Setup

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with MongoDB URI
npm run seed    # Optional: populate with sample data
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

---

## Backend Commands

### Development
```bash
npm run dev        # Start with auto-reload (nodemon)
npm start          # Start production server
npm run seed       # Seed database with sample books
npm run lint       # Run code linting
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with:
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: A secure random string
# - CLIENT_URL: Your frontend URL
```

### Sample Book Categories
- fiction
- non-fiction
- science
- history
- biography
- romance
- mystery
- self-help
- technology
- business
- adventure
- young-adult
- children
- cambodian

---

## Frontend Commands

### Development
```bash
npm run dev        # Start development server (http://localhost:3000)
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Environment Setup
```bash
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_BASE_URL to your backend URL
```

### Build & Deploy
```bash
npm run build       # Creates .next folder
vercel deploy       # Deploy to Vercel (requires Vercel CLI)
```

---

## API Endpoints

### Authentication
```
POST   /api/auth/register              - Register new user
POST   /api/auth/login                 - Login user
GET    /api/auth/me                    - Get current user (protected)
PUT    /api/auth/profile               - Update profile (protected)
POST   /api/auth/change-password       - Change password (protected)
```

### Books
```
GET    /api/books                      - Get all books (paginated)
GET    /api/books/trending             - Get trending books
GET    /api/books/new                  - Get new releases
GET    /api/books/popular              - Get popular books
GET    /api/books/:id                  - Get book by ID
GET    /api/books/search/suggestions   - Search suggestions
GET    /api/books/category/:category   - Books by category
GET    /api/books/:id/recommendations  - Similar books
```

### Orders
```
POST   /api/orders                     - Create order (protected)
GET    /api/orders                     - Get user's orders (protected)
GET    /api/orders/:id                 - Get order details (protected)
GET    /api/orders/:id/track           - Track order (protected)
POST   /api/orders/:id/cancel          - Cancel order (protected)
```

### Wishlist
```
GET    /api/wishlist                   - Get wishlist (protected)
POST   /api/wishlist                   - Add to wishlist (protected)
DELETE /api/wishlist/:bookId           - Remove from wishlist (protected)
GET    /api/wishlist/check/:bookId     - Check if in wishlist (protected)
```

### Reviews
```
GET    /api/reviews/book/:bookId       - Get book reviews
POST   /api/reviews                    - Create review (protected)
PUT    /api/reviews/:reviewId          - Update review (protected)
DELETE /api/reviews/:reviewId          - Delete review (protected)
POST   /api/reviews/:reviewId/helpful  - Mark as helpful (protected)
```

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get trending books
curl http://localhost:5000/api/books/trending

# Search
curl "http://localhost:5000/api/books?search=python"

# Get by category
curl "http://localhost:5000/api/books/category/fiction"
```

---

## Frontend Routes

### Public Routes
- `/` - Home page
- `/books` - Browse all books
- `/books/[id]` - Book detail page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (require login)
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/wishlist` - Saved favorites
- `/orders` - Order history

---

## Database Models

### User
```javascript
{
  username: String (unique)
  email: String (unique)
  password: String (hashed)
  fullName: String
  phoneNumber: String
  address: String
  city: String
  country: String
  avatar: String
  role: String (user/admin)
  isEmailVerified: Boolean
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Book
```javascript
{
  title: String
  author: String
  description: String
  isbn: String
  category: String
  priceUSD: Number
  priceKHR: Number
  discountPercent: Number (0-100)
  stock: Number
  coverImage: String
  images: [String]
  publishedDate: DateTime
  publisher: String
  pages: Number
  language: String
  format: String (hardcover/paperback/ebook)
  averageRating: Number (0-5)
  totalReviews: Number
  isTrending: Boolean
  isNew: Boolean
  isPopular: Boolean
  tags: [String]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Order
```javascript
{
  orderNumber: String (auto-generated)
  userId: ObjectId (ref: User)
  items: [{
    bookId: ObjectId
    bookTitle: String
    quantity: Number
    pricePerUnit: Number
    totalPrice: Number
  }]
  totalAmount: Number
  subtotal: Number
  shippingCost: Number
  tax: Number (10% of subtotal)
  status: String (pending/confirmed/shipped/delivered/cancelled)
  paymentStatus: String (pending/completed/failed/refunded)
  paymentMethod: String (credit-card/bank-transfer/cash-on-delivery/mobile-money)
  shippingAddress: Object
  trackingNumber: String
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Environment Variables

### Backend (.env)
```
# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/zbookstore

# Authentication
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

# Server
PORT=5000
NODE_ENV=development

# CORS
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```
# API
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

---

## Deployment Checklist

### Before Deployment
- [ ] Test all features locally
- [ ] Update environment variables
- [ ] Set up MongoDB Atlas database
- [ ] Generate secure JWT_SECRET
- [ ] Update CORS URL for production

### Deploy Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure build command
- [ ] Get backend URL

### Deploy Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set NEXT_PUBLIC_API_BASE_URL
- [ ] Deploy
- [ ] Verify all features work

### Post-Deployment
- [ ] Test all API endpoints
- [ ] Test user authentication
- [ ] Test payment flow (if integrated)
- [ ] Monitor logs for errors
- [ ] Set up monitoring/alerts

---

## Troubleshooting

### Backend Issues

**Port 5000 Already in Use**
```bash
# Mac/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**MongoDB Connection Error**
- Verify MONGODB_URI in .env
- Check IP whitelist on MongoDB Atlas
- Ensure credentials are correct
- Test connection: `mongosh <connection-string>`

**CORS Error**
- Update CLIENT_URL in backend .env
- Should match your frontend URL exactly
- Restart backend after change

**dotenv Not Loading**
```bash
# Ensure .env is in backend root directory
# Try: require('dotenv').config({path: './.env'})
```

### Frontend Issues

**API Connection Error**
- Verify backend is running
- Check NEXT_PUBLIC_API_BASE_URL
- Ensure CORS is enabled
- Check browser console for exact error

**Build Errors**
```bash
rm -rf .next node_modules
npm install
npm run build
```

**Port 3000 Already in Use**
```bash
# Mac/Linux
lsof -i :3000
kill -9 <PID>

# Windows: Change port
npm run dev -- -p 3001
```

**Image Loading Issues**
- Check image URLs are accessible
- Update next.config.mjs for new domains
- Rebuild frontend

---

## Features Checklist

### ✅ Completed Features
- [x] User authentication (JWT)
- [x] User registration
- [x] Login/logout
- [x] Profile management
- [x] Password change
- [x] Book browsing
- [x] Book search with suggestions
- [x] Filter by category
- [x] Pagination
- [x] Book detail page
- [x] Book reviews
- [x] Star ratings
- [x] Shopping cart
- [x] Add to cart
- [x] Remove from cart
- [x] Update quantity
- [x] Checkout page
- [x] Create orders
- [x] Order tracking
- [x] Order cancellation
- [x] Wishlist
- [x] Add/remove wishlist
- [x] Responsive design
- [x] Mobile-first approach
- [x] Smooth animations
- [x] Error handling
- [x] Loading states
- [x] Database seeding

### 📋 Future Features
- [ ] Email notifications
- [ ] Payment gateway (Stripe/PayPal)
- [ ] Admin dashboard
- [ ] Inventory management
- [ ] Real-time chat support
- [ ] User reviews moderation
- [ ] Discount codes
- [ ] Loyalty program
- [ ] Book recommendations (AI)
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Advanced search
- [ ] Book pre-orders
- [ ] Gift cards

---

## Getting Help

### Documentation
- Backend README: `backend/README.md`
- Frontend README: `frontend/README.md`
- Deployment Guide: `DEPLOYMENT.md`
- Project Summary: `PROJECT_SUMMARY.md`

### Resources
- Next.js Docs: https://nextjs.org/docs
- Express.js Guide: https://expressjs.com/
- MongoDB Docs: https://docs.mongodb.com/
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://github.com/pmndrs/zustand

### Common Tasks

**Add a new book category:**
1. Update backend Book model category enum
2. Update frontend category filter list
3. Redeploy

**Change pricing currency:**
1. Update Book model priceKHR calculation
2. Update formatPrice utility in frontend
3. Update Order model calculations

**Add new API endpoint:**
1. Create controller function
2. Create route in routes file
3. Add to routes in server.js
4. Create API method in frontend/lib/api.js

**Deploy to production:**
```bash
# Backend: Push to GitHub → Render auto-deploys
# Frontend: Push to GitHub → Vercel auto-deploys
```

---

## Version Info

- Node.js: v14+ required
- npm: v6+ required
- Next.js: 14.0
- Express: 4.18
- MongoDB: 7.0+
- React: 18.2

---

## License

MIT - Feel free to use this project for personal or commercial purposes

---

**Last Updated**: April 2026
**Status**: Production Ready ✅

**Happy Coding! 🚀**
