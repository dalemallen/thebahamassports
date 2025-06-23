// server/utils/errorHandler.js

 const handleError = (err, req, res) => {
  console.error(`[${req.method}] ${req.originalUrl} →`, err.message);
  res.status(500).json({ error: 'Internal server error' });
};

export default handleError;