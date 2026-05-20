const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 400;
  const message = err.message || 'Something went wrong';
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: err.code || 'VALIDATION_ERROR',
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;