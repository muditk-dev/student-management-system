const express = require('express');
const router = express.Router();
const { getDBStatus } = require('../config/db');

// @route   GET /api/health
// @desc    Health check endpoint for Render/uptime monitors and frontend connectivity check
// @access  Public
router.get('/', (req, res) => {
  const dbStatus = getDBStatus();
  const uptimeSeconds = Math.floor(process.uptime());

  const healthData = {
    status: dbStatus.isConnected ? 'ok' : 'degraded',
    service: 'Student Management System API',
    uptime: `${uptimeSeconds} seconds`,
    timestamp: new Date().toISOString(),
    database: {
      status: dbStatus.state,
      connected: dbStatus.isConnected,
      host: dbStatus.host,
      database: dbStatus.name,
    },
    environment: process.env.NODE_ENV || 'development',
  };

  // Always return 200 so cloud orchestrators (Render) keep the container alive and report accurate status
  res.status(200).json(healthData);
});

module.exports = router;
