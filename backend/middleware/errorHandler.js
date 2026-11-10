const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.code === 'SQLITE_CONSTRAINT') {
    return res.status(400).json({
      success: false,
      message: 'Database constraint violation',
      error: err.message
    });
  }

  if (err.message === 'Patient not found') {
    return res.status(404).json({
      success: false,
      message: 'Patient not found'
    });
  }

  if (err.message === 'Invalid patient ID') {
    return res.status(400).json({
      success: false,
      message: 'Invalid patient ID'
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
};

module.exports = errorHandler;
