// routes/tournaments.js
import express from 'express';
import pool from '../db/index.js';

const router = express.Router();

// GET /api/tournaments?sport=rugby
router.get('/', async (req, res) => {
  try {
    const { sport } = req.query;
    const result = await pool.query('SELECT * FROM tournaments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournaments' });
  }
});

// GET /api/tournaments/:id
router.get('/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const result = await pool.query('SELECT * FROM tournaments WHERE id = $1', [tournamentId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Tournament not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch tournament' });
  }
});

export default router;
