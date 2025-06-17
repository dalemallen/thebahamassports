export default function requireRole(requiredRole) {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !user.role || user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied: role required.' });
    }
    next();
  };
}
