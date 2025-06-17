import pool from '../db/index.js';

export const getDashboardData = async (req, res) => {
  const { role } = req.params;
  try {
    let data;
    switch (role) {
      case 'athlete':
        data = await pool.query('SELECT * FROM users WHERE $1 = ANY(roles)', [role]);
        break;
      case 'coach':
        data = await pool.query('SELECT * FROM teams');
        break;
      default:
        data = { message: 'Dashboard view not defined for this role' };
    }
    res.json(data.rows || data);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to retrieve dashboard data' });
  }
};
