import express from 'express';
import pool from '../db/index.js'; // adjust as needed

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM federations');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch federations' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM federations WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Federation not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch federation' });
  }
});

export default router;