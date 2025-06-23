// server/controllers/sportsController.js
import pool from '../db/index.js';

// GET /api/sports
 const getAllSports = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM sports ORDER BY name ASC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching sports:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// GET /api/sports-with-federations
 const getSportsWithFederations = async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT 
        s.id as sport_id, s.name as sport_name,
        f.id as federation_id, f.name as federation_name
      FROM sports s
      JOIN federations f ON f.sport_id = s.id
      ORDER BY s.name ASC
    `);
    const structured = rows.map(row => ({
      sport: { id: row.sport_id, name: row.sport_name },
      federation: { id: row.federation_id, name: row.federation_name },
    }));
    res.json(structured);
  } catch (err) {
    console.error('Error fetching sports with federations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


export default {
getAllSports,

getSportsWithFederations,
};
