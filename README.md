# Z Book - Full Stack Bookstore

Modern full-stack bookstore website for Cambodian Gen Z users.

## Project Overview

Z Book is a complete bookstore application with:
- **Frontend**: Next.js with React and Tailwind CSS
- **Backend**: Node.js with Express and MongoDB
- **Database**: MongoDB Atlas
- **Deployment**: Vercel (frontend) + Render (backend)

## Quick Start

### Local Development

#### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

Backend runs on: http://localhost:5000

#### 2. Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Frontend runs on: http://localhost:3000

### Database Seeding

After starting the backend:
```bash
cd backend
npm run seed
```

This will populate the database with 10 sample books.

## Project Structure

```
Z Book web/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── app/
│   ├── components/
│   ├── store/
│   ├── lib/
│   ├── styles/
│   ├── package.json
│   ├── next.config.mjs
│   ├── tailwind.config.js
│   ├── .env.local.example
│   └── README.md
├── DEPLOYMENT.md
└── README.md
```

## Key Features

### Frontend Features
- 🏠 Modern homepage with hero section
- 📚 Browse and filter books by category
- 🔍 Live search with suggestions
- 📖 Detailed book information pages
- ⭐ Book reviews and ratings
- 🛒 Shopping cart with quantity management
- 💳 Checkout with shipping details
- 🔐 User authentication (login/register)
- ❤️ Wishlist for favorite books
- 📱 Fully responsive mobile design
- ✨ Smooth animations with Framer Motion

### Backend Features
- 🔐 JWT-based authentication
- 📚 Complete CRUD operations for books
- 🛍️ Order management system
- ⭐ Review and rating system
- ❤️ Wishlist management
- 📊 MongoDB database with proper indexing
- 🛡️ Input validation and error handling
- 📝 Comprehensive API documentation
- 🌍 CORS-enabled for frontend integration

### Design Elements
- 🎨 Gen Z-inspired modern design
- 🌈 Vibrant gradient colors (Purple → Blue)
- 📱 Mobile-first responsive layout
- ✨ Smooth animations and transitions
- 🎭 Glass-morphism effects
- 💫 Subtle micro-interactions

## Tech Stack

### Frontend
- **Framework**: Next.js 14
- **React**: 18.2
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP**: Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Auth**: JWT
- **Password**: bcryptjs
- **Validation**: express-validator

## Database Models

### User
- Email, username, password (hashed)
- Full name, phone, address
- Avatar, role (user/admin)
- Timestamps

### Book
- Title, author, ISBN
- Description, category
- Price (USD/KHR), discount
- Stock, images
- Ratings, reviews count
- Tags, trending flags

### Order
- Order number, items
- Total amounts, tax, shipping
- Status, payment status
- Shipping address
- Tracking information

### Review
- Rating (1-5), title, comment
- User reference, verified purchase
- Helpful votes

### Wishlist
- User reference, book reference
- Timestamps

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile

### Books
- `GET /api/books` - Get all books
- `GET /api/books/trending` - Trending books
- `GET /api/books/new` - New books
- `GET /api/books/popular` - Popular books
- `GET /api/books/:id` - Book details
- `GET /api/books/search/suggestions` - Search
- `GET /api/books/category/:category` - By category
- `GET /api/books/:id/recommendations` - Similar books

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders
- `GET /api/orders/:id` - Order details
- `GET /api/orders/:id/track` - Track order
- `POST /api/orders/:id/cancel` - Cancel order

### Wishlist
- `GET /api/wishlist` - Get wishlist
- `POST /api/wishlist` - Add item
- `DELETE /api/wishlist/:bookId` - Remove item

### Reviews
- `GET /api/reviews/book/:bookId` - Get reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## Deployment

### Deploy to Vercel (Frontend)
```bash
cd frontend
npm run build
vercel deploy
```

### Deploy to Render (Backend)
1. Connect GitHub repository to Render
2. Set environment variables
3. Configure build and start commands
4. Deploy!

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
```

## Development Workflow

1. **Create feature branch**
   ```bash
   git checkout -b feature/feature-name
   ```

2. **Make changes and test locally**

3. **Commit changes**
   ```bash
   git add .
   git commit -m "Add: feature description"
   ```

4. **Push and create pull request**

## Performance Metrics

- ⚡ Next.js optimizations (Image, Code Splitting)
- 📊 MongoDB indexing for fast queries
- 🔄 Zustand for efficient state updates
- 🎯 API response time < 200ms
- 📱 Mobile-first CSS approach
- ♿ Accessibility best practices

## Best Practices Implemented

✅ Clean code with comments
✅ Organized folder structure
✅ SOLID principles
✅ DRY (Don't Repeat Yourself)
✅ Error handling and validation
✅ Environment configuration
✅ Git workflow
✅ Database indexing
✅ Security (password hashing, JWT)
✅ Responsive design
✅ Performance optimization
✅ API documentation

## Future Enhancements

- 📧 Email notifications
- 💬 User comments and discussions
- 🎁 Discount codes and promotions
- 📊 Admin dashboard
- 📦 Inventory management
- 🚚 Real shipping integration
- 💳 Payment gateway integration
- 📱 Mobile app (React Native)
- 🤖 Book recommendations AI
- 📈 Analytics dashboard

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

## Quick Commands

```bash
# Backend
npm run dev              # Start dev server
npm run seed            # Seed database
npm start               # Start production

# Frontend
npm run dev             # Start dev server
npm run build           # Build for production
npm run lint            # Run linter
```

---

**Happy coding! 🚀 Start building with Z Book today!**
