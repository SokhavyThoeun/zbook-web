/**
 * Authentication Controller
 * Handles user registration, login, and profile management
 */

const User = require('../models/User');
const { hashPassword, comparePassword, generateToken } = require('../utils/auth');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Register a new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    // Validation
    if (!username || !email || !password || !fullName) {
      return sendError(res, 400, 'Please provide all required fields');
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return sendError(res, 400, 'Email or username already exists');
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    sendSuccess(res, 201, 'User registered successfully', {
      user,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    sendError(res, 500, 'Error during registration');
  }
};

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return sendError(res, 400, 'Please provide email and password');
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Compare password
    const isPasswordCorrect = await comparePassword(password, user.password);

    if (!isPasswordCorrect) {
      return sendError(res, 401, 'Invalid email or password');
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    user.password = undefined;

    sendSuccess(res, 200, 'Login successful', {
      user,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Error during login');
  }
};

/**
 * Get current user profile
 * GET /api/auth/me
 */
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'Profile retrieved successfully', user);
  } catch (error) {
    console.error('Get profile error:', error);
    sendError(res, 500, 'Error retrieving profile');
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { fullName, phoneNumber, address, city, avatar } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        fullName: fullName || undefined,
        phoneNumber: phoneNumber || undefined,
        address: address || undefined,
        city: city || undefined,
        avatar: avatar || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    sendSuccess(res, 200, 'Profile updated successfully', user);
  } catch (error) {
    console.error('Update profile error:', error);
    sendError(res, 500, 'Error updating profile');
  }
};

/**
 * Change password
 * POST /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 400, 'Please provide current and new password');
    }

    // Get user with password field
    const user = await User.findById(req.userId).select('+password');

    if (!user) {
      return sendError(res, 404, 'User not found');
    }

    // Verify current password
    const isCorrect = await comparePassword(currentPassword, user.password);

    if (!isCorrect) {
      return sendError(res, 401, 'Current password is incorrect');
    }

    // Hash new password
    user.password = await hashPassword(newPassword);
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  } catch (error) {
    console.error('Change password error:', error);
    sendError(res, 500, 'Error changing password');
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
};
