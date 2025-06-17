import pool from '../db/index.js';

// POST /api/scouts
export const createScoutProfile = async (req, res) => {
  const { user_id, ...fields } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const columns = Object.keys(fields);
    const values = Object.values(fields);
    const placeholders = columns.map((_, i) => `$${i + 2}`);
    const setUpdates = columns.map((col, i) => `${col} = EXCLUDED.${col}`);

    const query = `
      INSERT INTO scouts_profiles (user_id, ${columns.join(', ')})
      VALUES ($1, ${placeholders.join(', ')})
      ON CONFLICT (user_id) DO UPDATE SET ${setUpdates.join(', ')};
    `;

    await pool.query(query, [user_id, ...values]);

    res.status(201).json({ message: 'Scout profile created or updated' });
  } catch (err) {
    console.error('createScoutProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/scouts/:id
export const getScoutProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT * FROM scouts_profiles
      WHERE user_id = $1
    `, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Scout profile not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('getScoutProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/scouts/:id
export const updateScoutProfile = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(', ');

    await pool.query(`
      UPDATE scouts_profiles
      SET ${setClause}
      WHERE user_id = $1
    `, [userId, ...values]);

    res.json({ message: 'Scout profile updated' });
  } catch (err) {
    console.error('updateScoutProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
