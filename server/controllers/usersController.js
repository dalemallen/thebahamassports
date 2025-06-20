// controllers/usersController.js
import pool from '../db/index.js';
import { v4 as uuidv4 } from 'uuid';



// 1. ✅ GET /api/users/:auth0_id
export const getUserByAuth0Id = async (req, res) => {

  const auth0_id = decodeURIComponent(req.params.auth0_id);
  try {
    const userRes = await pool.query(
      `SELECT u.*, r.name as role
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.auth0_id = $1`,
      [auth0_id]
    );
  console.log("Registering user with:", req.body);
    if (userRes.rowCount === 0) {
    
      
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json(userRes.rows[0]);
  } catch (err) {
    console.error('Error getting user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// 2. ✅ POST /api/users/register-user
export const registerUser = async (req, res) => {
  const { auth0_id, email, first_name = '', last_name = '', role } = req.body;

  if (!auth0_id || !email || !role) {
    return res.status(400).json({ error: 'auth0_id, email, and role are required.' });
  }

  try {
    // 1. Check if user already exists by auth0_id
    const existingUserRes = await pool.query(
      `SELECT u.id, u.onboarding_complete, r.name AS role
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.auth0_id = $1`,
      [auth0_id]
    );

    if (existingUserRes.rowCount > 0) {
      return res.status(200).json(existingUserRes.rows[0]);
    }

    // 2. Get role ID
    const roleRes = await pool.query(`SELECT id FROM roles WHERE name = $1`, [role]);
    if (roleRes.rowCount === 0) {
      return res.status(400).json({ error: 'Invalid role name' });
    }
    const roleId = roleRes.rows[0].id;

    // 3. Insert new user
    const id = uuidv4();
    await pool.query(
      `INSERT INTO users (id, auth0_id, email, first_name, last_name, onboarding_complete)
       VALUES ($1, $2, $3, $4, $5, false)
       ON CONFLICT (auth0_id) DO NOTHING`,
      [id, auth0_id, email, first_name, last_name]
    );

    // 4. Link user to role
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [id, roleId]
    );

    return res.status(201).json({ id, role, onboarding_complete: false });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// 3. ✅ PATCH /api/users/:id/complete-onboarding
export const completeOnboarding = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE users SET onboarding_complete = true WHERE id = $1`,
      [id]
    );
    res.status(200).json({ message: 'Onboarding complete.' });
  } catch (err) {
    console.error('Error updating onboarding:', err);
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

