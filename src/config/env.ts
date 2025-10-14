import dotenv from 'dotenv';
// Load environment variables
dotenv.config({ path: '.env' });

// Export environment variables
export const ENV = {
  MONGO_URI: process.env.DATABASE_URL,
  PORT: process.env.PORT,
  META_CONFIG: {
    APP_ID: process.env.META_APP_ID,
    APP_SECRET: process.env.META_APP_SECRET,
    BACKEND_URL: process.env.BACKEND_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    VERIFY_TOKEN: process.env.WEBHOOK_VERIFY_TOKEN
  }
};
