const mongoose = require('mongoose');

// Middleware to immediately return 503 if MongoDB is not connected
// Prevents buffering timeouts and provides instant diagnostic feedback
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message:
        'Database is currently disconnected. Please verify that MONGODB_URI is set in Render environment variables and that MongoDB Atlas has IP 0.0.0.0/0 whitelisted in Network Access.',
      databaseStatus: 'disconnected',
    });
  }
  next();
};

module.exports = checkDbConnection;
