/**
 * Category Controller
 * Handles category-related business logic
 */

const Category = require('../models/Category');
const Book = require('../models/Book');

// Get all categories
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true })
      .sort({ sortOrder: 1, name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// Get category by ID
exports.getCategoryById = async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Get book count for this category
    const bookCount = await Book.countDocuments({ category: category.id }).exec();

    res.status(200).json({
      success: true,
      data: {
        ...category,
        bookCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get books by category
exports.getBooksByCategory = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const books = await Book.find({ category: req.params.id })
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    const total = await Book.countDocuments({ category: req.params.id }).exec();

    res.status(200).json({
      success: true,
      count: books.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

// Create category (admin only)
exports.createCategory = async (req, res, next) => {
  try {
    const { id, name, description, icon } = req.body;

    // Check if category already exists
    const existing = await Category.findOne({ $or: [{ id }, { name }] });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Category with this ID or name already exists',
      });
    }

    const category = await Category.create({
      id,
      name,
      description,
      icon: icon || 'Book',
    });

    res.status(201).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// Update category (admin only)
exports.updateCategory = async (req, res, next) => {
  try {
    const { name, description, icon, isActive, sortOrder } = req.body;

    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (icon !== undefined) updateData.icon = icon;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    await Category.updateOne({ id: req.params.id }, { $set: updateData });

    res.status(200).json({
      success: true,
      data: { ...category, ...updateData },
    });
  } catch (error) {
    next(error);
  }
};

// Delete category (admin only)
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOne({ id: req.params.id });
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Check if category has books
    const bookCount = await Book.countDocuments({ category: req.params.id }).exec();
    if (bookCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with existing books',
      });
    }

    await Category.deleteOne({ id: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
