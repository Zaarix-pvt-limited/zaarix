const mongoose = require('mongoose');

const MONGO_OPTIONS = {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
};

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, MONGO_OPTIONS);
    console.log('✅ MongoDB connected successfully');

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
      setTimeout(() => connectToDB(), 5000);
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB error:', err.message);
    });
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    // Retry after 5 s so the server doesn't start with a dead DB
    console.log('🔄 Retrying MongoDB connection in 5 s...');
    setTimeout(() => connectToDB(), 5000);
  }
}

async function checkDBConnection() {
  return mongoose.connection.readyState === 1;
}

module.exports = { connectToDB, checkDBConnection };