import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';

// Rate limiting
export const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Apply security headers
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false
});

// XSS protection middleware
export const xssProtection = (req, res, next) => {
  // Sanitize request body, query, and params
  const sanitize = (obj) => {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = obj[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        } else if (typeof obj[key] === 'object') {
          sanitize(obj[key]);
        }
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  
  next();
};

// CSRF protection (for forms, if needed)
export const csrfProtection = (req, res, next) => {
  // Skip for API routes or if using JWT
  if (req.path.startsWith('/api/') || req.method === 'GET') {
    return next();
  }

  const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
  
  if (!csrfToken) {
    return res.status(403).json({
      success: false,
      message: 'CSRF token required'
    });
  }

  // In a real application, you would validate against a session token
  // For JWT-based apps, CSRF is less critical but still good practice
  next();
};

// Input validation middleware
export const validateInput = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  };
};

// SQL injection protection
export const sqlInjectionProtection = (req, res, next) => {
  const sqlKeywords = [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'UNION', 
    'OR', 'AND', 'WHERE', 'FROM', 'TABLE', 'DATABASE'
  ];
  
  const checkForSql = (obj) => {
    if (obj && typeof obj === 'object') {
      for (let key in obj) {
        if (typeof obj[key] === 'string') {
          const value = obj[key].toUpperCase();
          if (sqlKeywords.some(keyword => value.includes(keyword))) {
            return res.status(400).json({
              success: false,
              message: 'Invalid input detected'
            });
          }
        } else if (typeof obj[key] === 'object') {
          const result = checkForSql(obj[key]);
          if (result) return result;
        }
      }
    }
    return null;
  };

  const error = checkForSql(req.body) || checkForSql(req.query) || checkForSql(req.params);
  if (error) return error;
  
  next();
};