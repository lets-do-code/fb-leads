import mongoose from 'mongoose';
import { ENV } from './env';

const connecctDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI || '');
    console.log('Database connected 🎉🎉');
  } catch (error) {
    console.log('Database connection failed:', error);
  }
};

export default connecctDB;
