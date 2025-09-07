import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import config from './config/config.js';
import { securityHeaders, xssProtection, sqlInjectionProtection, createRateLimiter } from './middleware/security.js';
import apiRoutes from './routes/index.js';

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(xssProtection);
app.use(sqlInjectionProtection);

// Rate limiting
app.use(createRateLimiter(15 * 60 * 1000, 100, 'Too many requests from this IP'));

// CORS configuration
app.use(cors(config.cors));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files (if needed)
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: config.environment
  });
});

// API routes
app.use('/api', apiRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: Object.values(error.errors).map(err => err.message)
    });
  }

  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();
    
    const server = app.listen(config.server.port, () => {
      console.log(`Server running in ${config.environment} mode on port ${config.server.port}`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down server...');
      server.close(async () => {
        await mongoose.connection.close();
        console.log('Server shut down successfully');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;