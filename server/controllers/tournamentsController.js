// controllers/tournamentsController.js
import pool from '../db/index.js';

export const getAllTournaments = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tournaments ORDER BY start_date DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching tournaments:', err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
};

export const getTournamentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tournaments WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tournament not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching tournament:', err);
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
};

export const registerForTournament = async (req, res) => {
  try {
    const { team_id, tournament_id } = req.body;
    const result = await pool.query(
      'INSERT INTO tournament_registrations (team_id, tournament_id) VALUES ($1, $2) RETURNING *',
      [team_id, tournament_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error registering for tournament:', err);
    res.status(500).json({ error: 'Failed to register for tournament' });
  }
};
