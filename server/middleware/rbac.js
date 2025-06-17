export const requireRole = (roles) => {
  return (req, res, next) => {
    const userRoles = req.user?.roles || []; // Assuming roles are decoded into req.user

    const hasPermission = roles.some(role => userRoles.includes(role));
    if (!hasPermission) {
      return res.status(403).json({ error: 'Access denied: insufficient role' });
    }
    next();
  };
};
