import express from 'express';
import { body } from 'express-validator';
import { AsgardeoAuthClient } from '@asgardeo/oidc-node';
import User from '../models/User.js';
import { generateToken, authenticateToken } from '../middleware/auth.js';
import { validateInput } from '../middleware/security.js';

const router = express.Router();

// Initialize Asgardeo client
const asgardeoClient = new AsgardeoAuthClient({
  clientID: process.env.ASGARDEO_CLIENT_ID,
  clientSecret: process.env.ASGARDEO_CLIENT_SECRET,
  baseUrl: process.env.ASGARDEO_BASE_URL,
  redirectURI: process.env.ASGARDEO_REDIRECT_URI
});

// Register new user
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('firstName').trim().isLength({ min: 1, max: 50 }),
  body('lastName').trim().isLength({ min: 1, max: 50 })
], validateInput, async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Create new user
    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      emailVerified: false
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while registering user'
    });
  }
});

// Login user
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 })
], validateInput, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while logging in'
    });
  }
});

// Asgardeo OIDC login redirect
router.get('/asgardeo/login', async (req, res) => {
  try {
    const authUrl = await asgardeoClient.getAuthorizationURL();
    res.redirect(authUrl);
  } catch (error) {
    console.error('Asgardeo login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error initiating OAuth login'
    });
  }
});

// Asgardeo OIDC callback
router.get('/asgardeo/callback', async (req, res) => {
  try {
    const { code } = req.query;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code required'
      });
    }

    // Exchange code for tokens
    const tokens = await asgardeoClient.getAccessToken(code.toString());
    const userInfo = await asgardeoClient.getUserInfo(tokens.access_token);

    // Find or create user
    let user = await User.findOne({ 
      oauthId: userInfo.sub,
      oauthProvider: 'asgardeo'
    });

    if (!user) {
      user = new User({
        email: userInfo.email,
        firstName: userInfo.given_name,
        lastName: userInfo.family_name,
        oauthId: userInfo.sub,
        oauthProvider: 'asgardeo',
        emailVerified: true,
        avatar: userInfo.picture
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Redirect to frontend with token
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
  } catch (error) {
    console.error('Asgardeo callback error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing OAuth callback'
    });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: req.user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching user'
    });
  }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For JWT, since they're stateless, we just inform the client to remove the token
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
});

// Forgot password (initiate)
router.post('/forgot-password', [
  body('email').isEmail().normalizeEmail()
], validateInput, async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether email exists
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }

    // Generate reset token (simplified)
    const resetToken = generateToken(user._id);
    // In real app, you'd send an email with this token

    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent'
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while processing forgot password'
    });
  }
});

// Reset password
router.post('/reset-password', [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 })
], validateInput, async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify token and get user ID
    // In real app, you'd use a dedicated reset token system
    // This is simplified for demonstration
    const decoded = jwt.verify(token, config.jwt.secret);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = password;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while resetting password'
    });
  }
});

export default router;