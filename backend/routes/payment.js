import express from 'express';
import Stripe from 'stripe';
import config from '../config/config.js';
import Order from '../models/Order.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const stripe = new Stripe(config.stripe.secretKey);

// Create payment intent
router.post('/create-intent', authenticateToken, async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    // Verify order belongs to user
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        'customer.userId': req.user._id
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: req.user._id.toString(),
        orderId: orderId || 'none',
        customerEmail: req.user.email
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Create payment intent error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating payment intent'
    });
  }
});

// Confirm payment
router.post('/confirm', authenticateToken, async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed'
      });
    }

    // Update order payment status
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        'payment.status': 'completed',
        'payment.transactionId': paymentIntentId,
        status: 'confirmed'
      });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully'
    });
  } catch (error) {
    console.error('Confirm payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while confirming payment'
    });
  }
});

// Handle Stripe webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, config.stripe.webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Payment succeeded:', paymentIntent.id);
        
        // Update order status if orderId exists in metadata
        if (paymentIntent.metadata.orderId && paymentIntent.metadata.orderId !== 'none') {
          await Order.findByIdAndUpdate(paymentIntent.metadata.orderId, {
            'payment.status': 'completed',
            'payment.transactionId': paymentIntent.id,
            status: 'confirmed'
          });
        }
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        
        if (failedPayment.metadata.orderId && failedPayment.metadata.orderId !== 'none') {
          await Order.findByIdAndUpdate(failedPayment.metadata.orderId, {
            'payment.status': 'failed'
          });
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
});

// Get payment methods
router.get('/methods', authenticateToken, async (req, res) => {
  try {
    // In a real application, you might store customer payment methods
    // For now, we'll return supported payment methods
    res.json({
      success: true,
      data: {
        card: true,
        paypal: true,
        applepay: true
      }
    });
  } catch (error) {
    console.error('Get payment methods error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching payment methods'
    });
  }
});

export default router;