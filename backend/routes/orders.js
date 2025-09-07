import express from 'express';
import { body } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';
import { validateInput } from '../middleware/security.js';

const router = express.Router();

// Create new order
router.post('/', [
  authenticateToken,
  body('items').isArray({ min: 1 }),
  body('items.*.productId').isMongoId(),
  body('items.*.quantity').isInt({ min: 1 }),
  body('shippingAddress.firstName').trim().isLength({ min: 1 }),
  body('shippingAddress.lastName').trim().isLength({ min: 1 }),
  body('shippingAddress.street').trim().isLength({ min: 1 }),
  body('shippingAddress.city').trim().isLength({ min: 1 }),
  body('shippingAddress.postalCode').trim().isLength({ min: 1 }),
  body('shippingAddress.country').trim().isLength({ min: 1 }),
  body('payment.method').isIn(['card', 'paypal', 'applepay'])
], validateInput, async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, payment, notes } = req.body;

    // Verify products and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      
      if (!product || !product.isActive) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found or unavailable`
        });
      }

      if (!product.isInStock(item.quantity)) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`
        });
      }

      const itemTotal = product.discountedPrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        productId: product._id,
        name: product.name,
        price: product.discountedPrice,
        quantity: item.quantity,
        image: product.images[0]?.url,
        sku: product.sku
      });
    }

    // Calculate totals
    const tax = subtotal * 0.08; // 8% tax
    const shippingCost = 9.99; // Fixed shipping cost
    const total = subtotal + tax + shippingCost;

    // Create order
    const order = new Order({
      customer: {
        userId: req.user._id,
        email: req.user.email,
        name: `${req.user.firstName} ${req.user.lastName}`,
        phone: req.user.phone
      },
      items: orderItems,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      payment: {
        method: payment.method,
        amount: total,
        currency: 'USD'
      },
      shipping: {
        cost: shippingCost,
        method: 'standard'
      },
      subtotal,
      tax,
      total,
      notes
    });

    await order.save();

    // Update product stock
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } }
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// Get order by ID
router.get('/:orderId', authenticateToken, async (req, res) => {
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

// Cancel order
router.patch('/:orderId/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      'customer.userId': req.user._id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!order.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled at this stage'
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = req.body.reason;
    await order.save();

    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: item.quantity } }
      );
    }

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while cancelling order'
    });
  }
});

// Get order status
router.get('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      'customer.userId': req.user._id
    }).select('status shipping.trackingNumber');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: {
        status: order.status,
        trackingNumber: order.shipping.trackingNumber
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    console.error('Get order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order status'
    });
  }
});

export default router;