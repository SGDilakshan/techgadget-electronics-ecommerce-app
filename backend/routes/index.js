import express from 'express';
import { body, query } from 'express-validator';
import Product from '../models/Product.js';
import Review from '../models/Review.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';
import { validateInput } from '../middleware/security.js';

const router = express.Router();

// Get all products with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().trim(),
  query('brand').optional().trim(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('rating').optional().isInt({ min: 1, max: 5 }),
  query('search').optional().trim(),
  query('sort').optional().isIn(['price', '-price', 'rating', '-rating', 'newest', 'name'])
], validateInput, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      brand,
      minPrice,
      maxPrice,
      rating,
      search,
      sort = 'newest'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (brand) filter.brand = { $regex: brand, $options: 'i' };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    if (rating) filter['rating.average'] = { $gte: parseInt(rating) };
    
    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    let sortOptions = {};
    switch (sort) {
      case 'price': sortOptions = { price: 1 }; break;
      case '-price': sortOptions = { price: -1 }; break;
      case 'rating': sortOptions = { 'rating.average': 1 }; break;
      case '-rating': sortOptions = { 'rating.average': -1 }; break;
      case 'name': sortOptions = { name: 1 }; break;
      case 'newest': sortOptions = { createdAt: -1 }; break;
      default: sortOptions = { createdAt: -1 };
    }

    const skip = (page - 1) * limit;
    
    // Execute query
    const products = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-specifications -seo -__v');

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product || !product.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// Get product reviews
router.get('/:id/reviews', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 })
], validateInput, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({
      product: req.params.id,
      status: 'approved'
    })
      .populate('user', 'firstName lastName avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      product: req.params.id,
      status: 'approved'
    });

    res.json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching reviews'
    });
  }
});

// Create review (authenticated users only)
router.post('/:id/reviews', [
  authenticateToken,
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').trim().isLength({ min: 1, max: 100 }),
  body('comment').trim().isLength({ min: 1, max: 1000 })
], validateInput, async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    
    // Check if product exists
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: req.params.id,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product'
      });
    }

    // Create review
    const review = new Review({
      product: req.params.id,
      user: req.user._id,
      rating,
      title,
      comment,
      isVerified: true // Auto-verify for now
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating review'
    });
  }
});

// Get featured products
router.get('/featured/products', async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      isFeatured: true
    })
      .limit(8)
      .select('name price images rating');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured products'
    });
  }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { limit = 12 } = req.query;

    const products = await Product.find({
      category,
      isActive: true
    })
      .limit(parseInt(limit))
      .select('name price images rating brand');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

export default router;