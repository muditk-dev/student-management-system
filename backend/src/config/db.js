const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('\x1b[31m%s\x1b[0m', '=======================================================');
    console.error('\x1b[31m%s\x1b[0m', '[DATABASE ERROR] MONGODB_URI environment variable is missing!');
    console.error('\x1b[33m%s\x1b[0m', 'Please create a backend/.env file and provide your MongoDB Atlas connection string:');
    console.error('\x1b[36m%s\x1b[0m', 'MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_db?retryWrites=true&w=majority');
    console.error('\x1b[31m%s\x1b[0m', '=======================================================');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log('\x1b[32m%s\x1b[0m', `✓ MongoDB Connected Successfully: ${conn.connection.host} (Database: ${conn.connection.name})`);
    return true;
  } catch (error) {
    isConnected = false;
    console.error('\x1b[31m%s\x1b[0m', `✗ MongoDB Connection Failed: ${error.message}`);
    console.error('\x1b[33m%s\x1b[0m', 'Troubleshooting tips:');
    console.error('\x1b[33m%s\x1b[0m', '1. Verify your IP address is whitelisted in MongoDB Atlas (Network Access -> Add 0.0.0.0/0).');
    console.error('\x1b[33m%s\x1b[0m', '2. Verify database username and password in the connection string.');
    console.error('\x1b[33m%s\x1b[0m', '3. Ensure special characters in password are URL-encoded.');
    return false;
  }
};

const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  const stateCode = mongoose.connection.readyState;
  return {
    state: states[stateCode] || 'unknown',
    isConnected: stateCode === 1,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
};

module.exports = { connectDB, getDBStatus };
