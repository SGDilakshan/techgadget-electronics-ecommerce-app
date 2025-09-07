import express from 'express';
import { body } from 'express-validator';
import User from '../models/User.js';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateInput } from '../middleware/security.js';

const router = express.Router();

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
});

// Update user profile
router.put('/profile', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 1, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 1, max: 50 }),
  body('phone').optional().trim().isLength({ min: 10, max: 15 }),
  body('preferences.emailNotifications').optional().isBoolean(),
  body('preferences.newsletter').optional().isBoolean()
], validateInput, async (req, res) => {
  try {
    const { firstName, lastName, phone, preferences } = req.body;
    
    const updates = {};
    if (firstName) updates.firstName = firstName;
    if (lastName) updates.lastName = lastName;
    if (phone) updates.phone = phone;
    if (preferences) updates.preferences = { ...req.user.preferences, ...preferences };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
});

// Get user orders
router.get('/orders', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ 'customer.userId': req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments({ 'customer.userId': req.user._id });

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// Get specific order
router.get('/orders/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      'customer.userId': req.user._id
    }).populate('items.productId', 'name images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// Update user address
router.put('/address', [
  authenticateToken,
  body('addresses').isArray(),
  body('addresses.*.type').isIn(['home', 'work', 'other']),
  body('addresses.*.street').trim().isLength({ min: 1 }),
  body('addresses.*.city').trim().isLength({ min: 1 }),
  body('addresses.*.state').trim().isLength({ min: 1 }),
  body('addresses.*.postalCode').trim().isLength({ min: 1 }),
  body('addresses.*.country').trim().isLength({ min: 1 })
], validateInput, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { addresses: req.body.addresses },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Addresses updated successfully',
      data: user.addresses
    });
  } catch (error) {
    console.error('Update addresses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating addresses'
    });
  }
});

// Change password
router.put('/password', [
  authenticateToken,
  body('currentPassword').isLength({ min: 8 }),
  body('newPassword').isLength({ min: 8 })
], validateInput, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Verify current password
    const user = await User.findById(req.user._id);
    const isMatch = await user.comparePassword(currentPassword);
    
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
});

export default router;