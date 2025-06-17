export default function requireSelfOrAdmin(req, res, next) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const isSelf = user.id === req.params.id;
  const isAdmin = user.role === 'admin';

  if (!isSelf && !isAdmin) {
    return res.status(403).json({ error: 'Access denied: not self or admin' });
  }

  next();
}
