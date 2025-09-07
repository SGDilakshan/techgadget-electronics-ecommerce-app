import dotenv from 'dotenv';
import development from './default.json' assert { type: 'json' };

dotenv.config();

const config = {
  development: {
    ...development,
    database: {
      ...development.database,
      uri: process.env.MONGODB_URI || development.database.uri
    },
    jwt: {
      ...development.jwt,
      secret: process.env.JWT_SECRET || development.jwt.secret
    },
    stripe: {
      ...development.stripe,
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || development.stripe.webhookSecret
    }
  },
  production: {
    ...development,
    database: {
      ...development.database,
      uri: process.env.MONGODB_URI
    },
    jwt: {
      ...development.jwt,
      secret: process.env.JWT_SECRET
    },
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    },
    stripe: {
      webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];