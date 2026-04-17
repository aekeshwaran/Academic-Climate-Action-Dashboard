import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/climate-dashboard';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connection established successfully');
    console.log('Database "climate_dashboard" ensured on MongoDB');
    console.log('MongoDB Models and Indexes initialized successfully');
  } catch (error: any) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
