const mongoose = require('mongoose');

let isConnected = false;

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

async function checkDBConnection() {
  return mongoose.connection.readyState === 1; 
}

module.exports = { connectToDB, checkDBConnection };