import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (mongoUri && mongoUri.trim() !== '') {
      console.log('Connecting to MongoDB via URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
      return conn;
    }

    // In development or test, fall back gracefully to MongoMemoryServer
    console.log('No MONGODB_URI provided. Initializing in-memory MongoDB for development/testing...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const uri = memoryServer.getUri();
    const conn = await mongoose.connect(uri);
    console.log(`In-memory MongoDB Connected: ${conn.connection.host} (${uri})`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    // If external URI failed in development mode, try in-memory fallback
    if (process.env.NODE_ENV !== 'production' && !memoryServer) {
      try {
        console.log('Falling back to MongoMemoryServer for development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const uri = memoryServer.getUri();
        const conn = await mongoose.connect(uri);
        console.log(`In-memory MongoDB fallback Connected: ${conn.connection.host}`);
        return conn;
      } catch (fallbackErr) {
        console.error(`Memory server fallback failed: ${fallbackErr.message}`);
      }
    }
    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error closing DB:', err.message);
  }
};
