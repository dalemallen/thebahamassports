export const checkFederationRole = (requiredRole) => async (req, res, next) => {
  const { user_id } = req.user;
  const { federationId } = req.params;

  const result = await pool.query(`
    SELECT role FROM federation_roles
    WHERE user_id = $1 AND federation_id = $2
  `, [user_id, federationId]);

  const role = result.rows[0]?.role;

  if (!role || (requiredRole && role !== requiredRole)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  next();
};