# Z Book - Backend API

Modern bookstore API built with Node.js, Express, and MongoDB for Cambodian Gen Z users.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites

- Node.js v14+ and npm
- MongoDB Atlas account
- Git

### Installation

1. **Clone and navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your MongoDB URI and JWT secret:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zbookstore
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Seed the database with sample books**
   ```bash
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The API will be running at `http://localhost:5000`

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── bookController.js    # Book management
│   │   ├── orderController.js   # Order processing
│   │   ├── reviewController.js  # Reviews & ratings
│   │   └── wishlistController.js # Wishlist management
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── Book.js              # Book schema
│   │   ├── Order.js             # Order schema
│   │   ├── Review.js            # Review schema
│   │   └── Wishlist.js          # Wishlist schema
│   ├── routes/
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── bookRoutes.js        # Book endpoints
│   │   ├── orderRoutes.js       # Order endpoints
│   │   ├── reviewRoutes.js      # Review endpoints
│   │   └── wishlistRoutes.js    # Wishlist endpoints
│   ├── utils/
│   │   ├── auth.js              # Auth utilities
│   │   └── response.js          # Response formatting
│   ├── scripts/
│   │   └── seedDatabase.js      # Sample data
│   └── server.js                # Main app file
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/change-password` - Change password

### Books
- `GET /api/books` - Get all books (with pagination & filtering)
- `GET /api/books/trending` - Get trending books
- `GET /api/books/new` - Get new books
- `GET /api/books/popular` - Get popular books
- `GET /api/books/:id` - Get book details
- `GET /api/books/search/suggestions` - Search suggestions
- `GET /api/books/category/:category` - Books by category
- `GET /api/books/:id/recommendations` - Similar books

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/:id/track` - Track order
- `POST /api/orders/:id/cancel` - Cancel order

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:bookId` - Remove from wishlist
- `GET /api/wishlist/check/:bookId` - Check if in wishlist

### Reviews
- `GET /api/reviews/book/:bookId` - Get book reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/helpful` - Mark as helpful

## Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Authentication

Protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Deployment

### Deploy to Render

1. Create account on [render.com](https://render.com)
2. Connect your GitHub repository
3. Create new Web Service
4. Set environment variables
5. Deploy!

See deployment guide for detailed instructions.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `JWT_EXPIRE` | Token expiration time (e.g., 7d) |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | Environment (development/production) |
| `CLIENT_URL` | Frontend URL for CORS |

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

## Best Practices Implemented

✅ JWT authentication for secure API access
✅ Password hashing with bcryptjs
✅ Input validation and error handling
✅ RESTful API design
✅ MongoDB indexing for performance
✅ CORS enabled for frontend integration
✅ Centralized error handling
✅ Organized folder structure
✅ Clear code comments
✅ Sample data seeding

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
