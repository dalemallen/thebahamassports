import pool from '../db/index.js';

export const getBrackets = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM brackets');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching brackets:', error);
    res.status(500).json({ error: 'Failed to retrieve brackets' });
  }
};
