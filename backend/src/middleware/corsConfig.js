const cors = require('cors');

const configureCors = () => {
  const frontendUrlEnv = process.env.FRONTEND_URL;

  // Allowed default development origins
  const devOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
  ];

  // Parse comma-separated origins from FRONTEND_URL if provided
  let allowedOrigins = [...devOrigins];
  if (frontendUrlEnv) {
    if (frontendUrlEnv === '*') {
      return cors({ origin: '*' });
    }
    const customOrigins = frontendUrlEnv.split(',').map((o) => o.trim().replace(/\/$/, ''));
    allowedOrigins = [...new Set([...allowedOrigins, ...customOrigins])];
  }

  const corsOptions = {
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman, health checks)
      if (!origin) return callback(null, true);

      // Check if origin matches or is a Netlify preview deploy
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.netlify.app') ||
        process.env.NODE_ENV !== 'production';

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked] Origin "${origin}" not allowed by CORS policy.`);
        callback(new Error(`Origin ${origin} not allowed by CORS policy`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  };

  return cors(corsOptions);
};

module.exports = configureCors;
