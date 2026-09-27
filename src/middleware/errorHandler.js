function errorHandler(err, req, res, next) {
  console.error('Unhandled Application Error:', err);

  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
    return res.status(statusCode).json({ error: message });
  }

  res.status(statusCode).render('index', {
    error: `An unexpected error occurred: ${message}`,
    pageTitle: 'OpportuNest - Error'
  });
}

module.exports = errorHandler;
