import pool from '../db/index.js'; // assume you have a db client (pg or knex)

exports.registerUser = async (req, res) => {
  const { auth0_id, email, first_name, last_name, role } = req.body;

  if (!auth0_id || !email || !role) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create user record
    await pool.query(
      `INSERT INTO users (id, email, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [auth0_id, email, first_name, last_name]
    );

    // Get role ID
    const roleResult = await pool.query(
      'SELECT id FROM roles WHERE name = $1',
      [role]
    );

    if (roleResult.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const roleId = roleResult.rows[0].id;

    // Assign role to user
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [auth0_id, roleId]
    );

    res.status(201).json({ message: 'User registered and role assigned' });
  } catch (err) {
    console.error('registerUser error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const userResult = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      onboarding_complete: user.onboarding_complete,
      role: user.role,
      profileCompleted: user.onboarding_complete // for frontend compatibility
    });
  } catch (err) {
    console.error('getUserById error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.completeOnboarding = async (req, res) => {
  const userId = req.params.id;

  try {
    await pool.query(
      `UPDATE users SET onboarding_complete = TRUE WHERE id = $1`,
      [userId]
    );

    res.json({ message: 'Onboarding completed' });
  } catch (err) {
    console.error('completeOnboarding error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};