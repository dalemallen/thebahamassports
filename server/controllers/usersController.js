// controllers/usersController.js
import pool from '../db/index.js';

export const registerUser = async (req, res) => {
  const { auth0_id, email, first_name = '', last_name = '', role } = req.body;

  if (!auth0_id || !email || !role) {
    return res.status(400).json({ error: 'auth0_id, email, and role are required.' });
  }

  try {
    // Insert user if not exists
    await pool.query(
      `INSERT INTO users (id, email, first_name, last_name)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO NOTHING`,
      [auth0_id, email, first_name, last_name]
    );

    // Get role ID
    const roleRes = await pool.query(
      `SELECT id FROM roles WHERE name = $1`,
      [role]
    );

    if (roleRes.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid role name' });
    }

    const roleId = roleRes.rows[0].id;

    // Insert user-role link if not already exists
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, role_id) DO NOTHING`,
      [auth0_id, roleId]
    );

    res.status(201).json({ message: 'User registered and role assigned.' });
  } catch (error) {
    console.error('registerUser error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = $1`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    res.json({
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      onboarding_complete: user.onboarding_complete,
      role: user.role,
      profileCompleted: user.onboarding_complete,
    });
  } catch (error) {
    console.error('getUserById error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const completeOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE users SET onboarding_complete = TRUE WHERE id = $1`,
      [id]
    );
    res.json({ message: 'Onboarding completed' });
  } catch (error) {
    console.error('completeOnboarding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
