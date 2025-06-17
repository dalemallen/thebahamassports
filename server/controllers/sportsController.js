// server/controllers/sportsController.js
import db from '../db/index.js';
import pool from '../db/index.js';

export const getAllSports = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM sports ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sports:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
