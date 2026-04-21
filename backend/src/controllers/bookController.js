/**
 * Book Controller
 * Handles book listing, searching, and details
 */

const Book = require('../models/Book');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Get all books with pagination and filtering
 * GET /api/books
 */
const getAllBooks = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, search, sort = '-createdAt' } = req.query;
    const skip = (page - 1) * limit;

    // Build filter
    let filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Book.countDocuments(filter);

    sendSuccess(res, 200, 'Books retrieved successfully', {
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get all books error:', error);
    sendError(res, 500, 'Error retrieving books');
  }
};

/**
 * Get trending books
 * GET /api/books/trending
 */
const getTrendingBooks = async (req, res) => {
  try {
    const books = await Book.find({ isTrending: true })
      .limit(12)
      .sort('-averageRating');

    sendSuccess(res, 200, 'Trending books retrieved', books);
  } catch (error) {
    console.error('Get trending books error:', error);
    sendError(res, 500, 'Error retrieving trending books');
  }
};

/**
 * Get new books
 * GET /api/books/new
 */
const getNewBooks = async (req, res) => {
  try {
    const books = await Book.find({ isNew: true })
      .limit(12)
      .sort('-createdAt');

    sendSuccess(res, 200, 'New books retrieved', books);
  } catch (error) {
    console.error('Get new books error:', error);
    sendError(res, 500, 'Error retrieving new books');
  }
};

/**
 * Get popular books
 * GET /api/books/popular
 */
const getPopularBooks = async (req, res) => {
  try {
    const books = await Book.find({ isPopular: true })
      .limit(12)
      .sort('-totalReviews');

    sendSuccess(res, 200, 'Popular books retrieved', books);
  } catch (error) {
    console.error('Get popular books error:', error);
    sendError(res, 500, 'Error retrieving popular books');
  }
};

/**
 * Get book by ID with reviews
 * GET /api/books/:id
 */
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate('reviews');

    if (!book) {
      return sendError(res, 404, 'Book not found');
    }

    sendSuccess(res, 200, 'Book retrieved successfully', book);
  } catch (error) {
    console.error('Get book by ID error:', error);
    sendError(res, 500, 'Error retrieving book');
  }
};

/**
 * Search books with live suggestions
 * GET /api/books/search/suggestions
 */
const searchSuggestions = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.length < 2) {
      return sendSuccess(res, 200, 'No suggestions', []);
    }

    const suggestions = await Book.find(
      {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
        ],
      },
      { title: 1, author: 1, coverImage: 1 }
    )
      .limit(10);

    sendSuccess(res, 200, 'Suggestions retrieved', suggestions);
  } catch (error) {
    console.error('Search suggestions error:', error);
    sendError(res, 500, 'Error retrieving suggestions');
  }
};

/**
 * Get books by category
 * GET /api/books/category/:category
 */
const getByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (page - 1) * limit;

    const books = await Book.find({ category })
      .skip(skip)
      .limit(parseInt(limit))
      .sort('-createdAt');

    const total = await Book.countDocuments({ category });

    sendSuccess(res, 200, 'Books retrieved', {
      books,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get by category error:', error);
    sendError(res, 500, 'Error retrieving books');
  }
};

/**
 * Get book recommendations based on category
 * GET /api/books/:id/recommendations
 */
const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);

    if (!book) {
      return sendError(res, 404, 'Book not found');
    }

    const recommendations = await Book.find({
      category: book.category,
      _id: { $ne: id },
    })
      .limit(8)
      .sort('-averageRating');

    sendSuccess(res, 200, 'Recommendations retrieved', recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    sendError(res, 500, 'Error retrieving recommendations');
  }
};

module.exports = {
  getAllBooks,
  getTrendingBooks,
  getNewBooks,
  getPopularBooks,
  getBookById,
  searchSuggestions,
  getByCategory,
  getRecommendations,
};
