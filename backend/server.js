const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');

// Load environment variables from .env file (if present)
dotenv.config({ path: path.join(__dirname, '.env') });

const { connectDB } = require('./src/config/db');
const configureCors = require('./src/middleware/corsConfig');
const errorHandler = require('./src/middleware/errorHandler');

const studentRoutes = require('./src/routes/studentRoutes');
const healthRoutes = require('./src/routes/healthRoutes');

const app = express();

// Connect to MongoDB Database
connectDB();

// CORS Middleware
app.use(configureCors());

// Request Body Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// API Root Information
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'Student Information Management System API',
    version: '1.0.0',
    description: 'REST API built with Node.js, Express, and MongoDB Mongoose',
    endpoints: {
      health: 'GET /api/health',
      students: 'GET /api/students',
      studentStats: 'GET /api/students/stats',
      studentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
    documentation: 'See README.md for full project setup and deployment guides',
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/students', studentRoutes);

// Catch 404 for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------------');
  console.log('\x1b[32m%s\x1b[0m', `✓ Server is running on port ${PORT}`);
  console.log('\x1b[34m%s\x1b[0m', `  Local API:   http://localhost:${PORT}`);
  console.log('\x1b[34m%s\x1b[0m', `  Health Check: http://localhost:${PORT}/api/health`);
  console.log('\x1b[34m%s\x1b[0m', `  Students:    http://localhost:${PORT}/api/students`);
  console.log('\x1b[36m%s\x1b[0m', '-------------------------------------------------------');
});

// Handle unhandled promise rejections gracefully
process.on('unhandledRejection', (err) => {
  console.error('\x1b[31m%s\x1b[0m', `Unhandled Promise Rejection: ${err.message}`);
});

module.exports = app;
