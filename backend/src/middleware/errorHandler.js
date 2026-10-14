const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error in console for debugging
  console.error('\x1b[31m%s\x1b[0m', `[API Error] ${req.method} ${req.originalUrl}:`, err);

  // Mongoose Bad ObjectId / CastError
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid format for field: ${err.path}`,
    });
  }

  // Mongoose Duplicate Key Error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    return res.status(409).json({
      success: false,
      message: `Duplicate entry: A record with ${field} "${value}" already exists.`,
    });
  }

  // Mongoose Schema Validation Error
  if (err.name === 'ValidationError') {
    const errorDetails = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: errorDetails.join(', '),
      errors: Object.keys(err.errors).reduce((acc, key) => {
        acc[key] = err.errors[key].message;
        return acc;
      }, {}),
    });
  }

  // Fallback to 500 Internal Server Error
  const statusCode = error.statusCode || res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error. Please try again later.',
  });
};

module.exports = errorHandler;
