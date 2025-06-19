// controllers/leaguesController.js
import pool from '../db/index.js';

export const getAllLeagues = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM leagues ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching leagues:', err);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
};

export const getLeagueById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM leagues WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'League not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching league:', err);
    res.status(500).json({ error: 'Failed to fetch league' });
  }
};

export const registerForLeague = async (req, res) => {
  try {
    const { team_id, league_id } = req.body;
    const result = await pool.query(
      'INSERT INTO league_registrations (team_id, league_id) VALUES ($1, $2) RETURNING *',
      [team_id, league_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering for league:', err);
    res.status(500).json({ error: 'Failed to register for league' });
  }
};