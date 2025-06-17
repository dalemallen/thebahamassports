// server/utils/errorHandler.js

export const handleError = (err, req, res) => {
  console.error(`[${req.method}] ${req.originalUrl} →`, err.message);
  res.status(500).json({ error: 'Internal server error' });
};
