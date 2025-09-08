import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri || typeof uri !== 'string') {
      throw new Error('MONGO_URI is not set or is invalid. Ensure your .env has MONGO_URI=... and that dotenv is loading it.');
    }

    // Mongoose 8: no need for useNewUrlParser/useUnifiedTopology
    const conn = await mongoose.connect(uri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;


