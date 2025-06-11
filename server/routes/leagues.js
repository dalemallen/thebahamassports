import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/leagues?sport=rugby
router.get('/', async (req, res) => {
  try {
    const { sport } = req.query;
    const result = await pool.query('SELECT * FROM leagues WHERE sport = $1', [sport]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch leagues' });
  }
});

// GET /api/leagues/:id/teams
router.get('/:id/teams', async (req, res) => {
  try {
    const leagueId = req.params.id;
    const result = await pool.query('SELECT * FROM teams WHERE league_id = $1', [leagueId]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch teams for league' });
  }
});

// GET /api/leagues/:id/matches
router.get('/:id/matches', async (req, res) => {
  try {
    const leagueId = req.params.id;
    const result = await pool.query(
      'SELECT * FROM matches WHERE league_id = $1 ORDER BY match_date ASC',
      [leagueId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch matches for league' });
  }
});

export default router;
