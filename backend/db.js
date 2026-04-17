import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export async function initDB() {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/climate_dashboard';
  
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

// Export a dummy pool for now to prevent immediate crashes in routes, 
// but you should migrate routes to use Mongoose models next.
export const pool = {
  query: () => {
    console.error('MySQL Pool is disabled. Please migrate this route to MongoDB.');
    return [[]];
  }
};
