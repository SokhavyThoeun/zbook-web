# 📚 Z Book - Complete API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-backend-url.onrender.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```bash
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "avatar": "https://dicebear.com/api/avataaars/johndoe",
    "role": "user",
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: User already exists
- 400: Invalid email format
- 400: Password too short

---

### 2. Login User
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "username": "johndoe",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "user"
    }
  }
}
```

**Errors:**
- 401: Invalid credentials
- 404: User not found

---

### 3. Get Current User Profile
**GET** `/auth/me` (Protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "username": "johndoe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "phoneNumber": "+855 12 345 678",
    "address": "123 Street, Phnom Penh",
    "city": "Phnom Penh",
    "country": "Cambodia",
    "avatar": "https://dicebear.com/api/avataaars/johndoe",
    "role": "user",
    "isEmailVerified": false,
    "createdAt": "2026-04-15T10:30:00Z",
    "updatedAt": "2026-04-15T10:30:00Z"
  }
}
```

---

### 4. Update Profile
**PUT** `/auth/profile` (Protected)

**Request:**
```json
{
  "fullName": "John Doe Updated",
  "phoneNumber": "+855 12 345 678",
  "address": "456 New Street",
  "city": "Siem Reap",
  "country": "Cambodia"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { /* Updated user object */ }
}
```

---

### 5. Change Password
**POST** `/auth/change-password` (Protected)

**Request:**
```json
{
  "currentPassword": "oldpassword123",
  "newPassword": "newpassword456"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Errors:**
- 400: Current password is incorrect
- 400: New password must be different

---

## Book Endpoints

### 1. Get All Books
**GET** `/books`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 12) - Items per page
- `search` (optional) - Search in title/author
- `category` (optional) - Filter by category
- `sort` (optional) - Sort field (priceUSD, averageRating, createdAt)
- `order` (optional) - Sort order (asc, desc)

**Example:**
```bash
GET /books?page=1&limit=20&category=fiction&sort=averageRating&order=desc
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "title": "The Art of Programming",
      "author": "John Smith",
      "description": "Learn programming...",
      "isbn": "978-0-123456-78-9",
      "category": "technology",
      "priceUSD": 29.99,
      "priceKHR": 121956,
      "discountPercent": 10,
      "stock": 50,
      "coverImage": "https://...",
      "averageRating": 4.5,
      "totalReviews": 42,
      "isTrending": true,
      "isNew": false,
      "isPopular": true,
      "publishedDate": "2026-01-15",
      "createdAt": "2026-04-15T10:30:00Z"
    }
    // ... more books
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20
  }
}
```

---

### 2. Get Trending Books
**GET** `/books/trending`

**Query Parameters:**
- `limit` (optional, default: 6) - Number of books

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of trending books */ ]
}
```

---

### 3. Get New Releases
**GET** `/books/new`

**Query Parameters:**
- `limit` (optional, default: 6) - Number of books
- `days` (optional, default: 30) - Days since published

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of new books */ ]
}
```

---

### 4. Get Popular Books
**GET** `/books/popular`

**Query Parameters:**
- `limit` (optional, default: 6) - Number of books
- `minRating` (optional, default: 4) - Minimum rating

**Response (200):**
```json
{
  "success": true,
  "data": [ /* array of popular books */ ]
}
```

---

### 5. Get Book by ID
**GET** `/books/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "title": "The Art of Programming",
    "author": "John Smith",
    "description": "Comprehensive guide...",
    "isbn": "978-0-123456-78-9",
    "category": "technology",
    "priceUSD": 29.99,
    "priceKHR": 121956,
    "discountPercent": 10,
    "originalPriceUSD": 33.32,
    "discountedPriceUSD": 29.99,
    "stock": 50,
    "coverImage": "https://...",
    "images": ["https://...", "https://..."],
    "publishedDate": "2026-01-15",
    "publisher": "Tech Press",
    "pages": 450,
    "language": "English",
    "format": "hardcover",
    "averageRating": 4.5,
    "totalReviews": 42,
    "isTrending": true,
    "isNew": false,
    "isPopular": true,
    "tags": ["programming", "web"],
    "reviews": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "userId": "507f1f77bcf86cd799439011",
        "rating": 5,
        "reviewText": "Excellent book!",
        "helpful": 15,
        "notHelpful": 2,
        "createdAt": "2026-04-15T10:30:00Z"
      }
    ],
    "createdAt": "2026-04-15T10:30:00Z",
    "updatedAt": "2026-04-15T10:30:00Z"
  }
}
```

**Errors:**
- 404: Book not found

---

### 6. Search Books with Suggestions
**GET** `/books/search/suggestions`

**Query Parameters:**
- `q` (required) - Search query
- `limit` (optional, default: 5) - Number of suggestions

**Response (200):**
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "The Art of Programming",
        "author": "John Smith",
        "coverImage": "https://..."
      }
    ]
  }
}
```

---

### 7. Get Books by Category
**GET** `/books/category/:category`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 12)

**Valid Categories:**
- fiction, non-fiction, science, history, biography, romance, mystery, self-help, technology, business, adventure, young-adult, children, cambodian

**Response (200):**
```json
{
  "success": true,
  "data": [ /* books in category */ ],
  "pagination": { /* ... */ }
}
```

---

### 8. Get Recommendations
**GET** `/books/:id/recommendations`

**Query Parameters:**
- `limit` (optional, default: 4) - Number of recommendations

**Response (200):**
```json
{
  "success": true,
  "data": [ /* similar books */ ]
}
```

---

## Order Endpoints

### 1. Create Order
**POST** `/orders` (Protected)

**Request:**
```json
{
  "items": [
    {
      "bookId": "507f1f77bcf86cd799439012",
      "quantity": 2
    }
  ],
  "paymentMethod": "credit-card",
  "shippingAddress": {
    "street": "123 Main Street",
    "city": "Phnom Penh",
    "state": "Phnom Penh",
    "postalCode": "12000",
    "country": "Cambodia"
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-2026-04-15-001",
    "userId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "bookId": "507f1f77bcf86cd799439012",
        "bookTitle": "The Art of Programming",
        "quantity": 2,
        "pricePerUnit": 29.99,
        "totalPrice": 59.98
      }
    ],
    "subtotal": 59.98,
    "tax": 6.00,
    "shippingCost": 5.00,
    "totalAmount": 70.98,
    "status": "pending",
    "paymentStatus": "pending",
    "paymentMethod": "credit-card",
    "shippingAddress": { /* ... */ },
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: Book not found
- 400: Insufficient stock
- 401: Unauthorized (not logged in)

---

### 2. Get User's Orders
**GET** `/orders` (Protected)

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 10)
- `status` (optional) - Filter by status

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-2026-04-15-001",
      "totalAmount": 70.98,
      "status": "shipped",
      "paymentStatus": "completed",
      "createdAt": "2026-04-15T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 3. Get Order Details
**GET** `/orders/:id` (Protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-2026-04-15-001",
    "userId": "507f1f77bcf86cd799439011",
    "items": [ /* ... */ ],
    "subtotal": 59.98,
    "tax": 6.00,
    "shippingCost": 5.00,
    "totalAmount": 70.98,
    "status": "shipped",
    "paymentStatus": "completed",
    "paymentMethod": "credit-card",
    "shippingAddress": { /* ... */ },
    "trackingNumber": "TRK123456789",
    "createdAt": "2026-04-15T10:30:00Z",
    "updatedAt": "2026-04-16T10:30:00Z"
  }
}
```

---

### 4. Track Order
**GET** `/orders/:id/track` (Protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "orderNumber": "ORD-2026-04-15-001",
    "status": "shipped",
    "trackingNumber": "TRK123456789",
    "estimatedDelivery": "2026-04-20",
    "timeline": [
      {
        "status": "pending",
        "timestamp": "2026-04-15T10:30:00Z",
        "description": "Order confirmed"
      },
      {
        "status": "confirmed",
        "timestamp": "2026-04-15T15:00:00Z",
        "description": "Payment received"
      },
      {
        "status": "packed",
        "timestamp": "2026-04-16T08:00:00Z",
        "description": "Preparing for shipment"
      },
      {
        "status": "shipped",
        "timestamp": "2026-04-16T10:30:00Z",
        "description": "On the way"
      }
    ]
  }
}
```

---

### 5. Cancel Order
**POST** `/orders/:id/cancel` (Protected)

**Request:**
```json
{
  "reason": "Changed my mind"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Order cancelled successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "status": "cancelled",
    "cancellationReason": "Changed my mind"
  }
}
```

**Errors:**
- 400: Cannot cancel shipped/delivered orders
- 404: Order not found
- 401: Unauthorized

---

## Wishlist Endpoints

### 1. Get Wishlist
**GET** `/wishlist` (Protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439015",
    "userId": "507f1f77bcf86cd799439011",
    "books": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "title": "The Art of Programming",
        "author": "John Smith",
        "priceUSD": 29.99,
        "coverImage": "https://...",
        "averageRating": 4.5
      }
    ],
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

---

### 2. Add to Wishlist
**POST** `/wishlist` (Protected)

**Request:**
```json
{
  "bookId": "507f1f77bcf86cd799439012"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Book added to wishlist",
  "data": { /* updated wishlist */ }
}
```

**Errors:**
- 400: Book already in wishlist
- 404: Book not found

---

### 3. Remove from Wishlist
**DELETE** `/wishlist/:bookId` (Protected)

**Response (200):**
```json
{
  "success": true,
  "message": "Book removed from wishlist",
  "data": { /* updated wishlist */ }
}
```

---

### 4. Check if Book in Wishlist
**GET** `/wishlist/check/:bookId` (Protected)

**Response (200):**
```json
{
  "success": true,
  "data": {
    "inWishlist": true
  }
}
```

---

## Review Endpoints

### 1. Get Book Reviews
**GET** `/reviews/book/:bookId`

**Query Parameters:**
- `page` (optional, default: 1)
- `limit` (optional, default: 5)
- `sort` (optional) - newest, helpful

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439016",
      "userId": {
        "_id": "507f1f77bcf86cd799439011",
        "username": "johndoe",
        "avatar": "https://..."
      },
      "bookId": "507f1f77bcf86cd799439012",
      "rating": 5,
      "reviewText": "Amazing book!",
      "verifiedPurchase": true,
      "helpful": 25,
      "notHelpful": 2,
      "createdAt": "2026-04-15T10:30:00Z"
    }
  ],
  "pagination": { /* ... */ }
}
```

---

### 2. Create Review
**POST** `/reviews` (Protected)

**Request:**
```json
{
  "bookId": "507f1f77bcf86cd799439012",
  "rating": 5,
  "reviewText": "This book is exceptional!"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Review posted successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439016",
    "bookId": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "rating": 5,
    "reviewText": "This book is exceptional!",
    "helpful": 0,
    "notHelpful": 0,
    "createdAt": "2026-04-15T10:30:00Z"
  }
}
```

**Errors:**
- 400: user has already reviewed this book
- 400: Rating must be between 1-5

---

### 3. Update Review
**PUT** `/reviews/:reviewId` (Protected)

**Request:**
```json
{
  "rating": 4,
  "reviewText": "Great book, but could be better"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Review updated successfully",
  "data": { /* updated review */ }
}
```

---

### 4. Delete Review
**DELETE** `/reviews/:reviewId` (Protected)

**Response (200):**
```json
{
  "success": true,
  "message": "Review deleted successfully"
}
```

---

### 5. Mark Review as Helpful
**POST** `/reviews/:reviewId/helpful` (Protected)

**Request:**
```json
{
  "helpful": true  // or false for not helpful
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Thank you for your feedback",
  "data": {
    "helpful": 26,
    "notHelpful": 2
  }
}
```

---

## Error Responses

### Common Error Formats

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Invalid request",
  "error": "Detailed error message"
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "No token provided"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You don't have permission"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Not found",
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "An unexpected error occurred"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, add rate limiting middleware:

```bash
npm install express-rate-limit
```

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "fullName": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Get All Books:**
```bash
curl http://localhost:5000/api/books?page=1&limit=10
```

**Create Order (with token):**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "items": [{"bookId": "507f1f77bcf86cd799439012", "quantity": 1}],
    "paymentMethod": "credit-card",
    "shippingAddress": {"street": "123 Street", "city": "Phnom Penh", "country": "Cambodia"}
  }'
```

### Using Postman

1. Import Base URL: `http://localhost:5000/api`
2. Set Authorization: Bearer `<token>` for protected routes
3. Use JSON body for POST/PUT requests
4. Add `Content-Type: application/json` header

---

## Best Practices

1. **Always validate input** on frontend before sending
2. **Store tokens securely** - use httpOnly cookies for web apps
3. **Handle errors gracefully** - show user-friendly messages
4. **Use pagination** for large datasets
5. **Cache frequently accessed data** - books, categories
6. **Implement retry logic** for failed requests
7. **Log important actions** for debugging
8. **Test all endpoints** before deployment
9. **Update documentation** when adding new endpoints
10. **Monitor API performance** and response times

---

**Last Updated**: April 2026
**API Version**: v1.0
**Status**: Production Ready ✅
