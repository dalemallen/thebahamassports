const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const roles = req.auth?.['https://thebahamassports.com/roles'] || [];
    if (roles.includes(requiredRole)) return next();
    return res.status(403).json({ message: 'Forbidden: Insufficient role' });
  };
};

export default checkRole;
