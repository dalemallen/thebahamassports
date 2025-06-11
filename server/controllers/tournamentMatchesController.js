
import pool from '../db/index.js';

// Get all tournament matches
export const getTournamentMatches = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM tournament_matches ORDER BY date DESC');
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

// Create a new tournament match
export const createTournamentMatch = async (req, res, next) => {
  try {
    const { tournament_id, team1_id, team2_id, score_team1, score_team2, date, location, bracket } = req.body;
    const result = await pool.query(
      'INSERT INTO tournament_matches (tournament_id, team1_id, team2_id, score_team1, score_team2, date, location, bracket) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [tournament_id, team1_id, team2_id, score_team1, score_team2, date, location, bracket]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    next(err);
  }
};
