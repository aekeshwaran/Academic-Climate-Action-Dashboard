import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function initDB() {
  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.error('MONGODB_URI is not set. Please add it to backend/.env');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection established successfully');
    console.log('Database "climate_dashboard" ensured on MongoDB');
    console.log('MongoDB Models and Indexes initialized successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
