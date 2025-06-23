// 📁 server/utils/getUserIdFromAuth0.js
import pool from '../db/index.js';

const getUserIdFromAuth0 = async (auth0_id) => {
    console.log('auth0_id: ', auth0_id);
  const { rows } = await pool.query(
    'SELECT id FROM users WHERE auth0_id = $1 LIMIT 1',
    [auth0_id]
  );

  if (rows.length === 0) {
    throw new Error('User not found for given auth0_id');
  }

  return rows[0].id;
};

export default getUserIdFromAuth0;
