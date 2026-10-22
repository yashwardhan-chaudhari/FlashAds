import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/flashads', {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[MongoDB] Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB] Warning: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[MongoDB] Ensure local MongoDB service is running or set MONGO_URI in .env.`);
    return false;
  }
};

export default connectDB;

