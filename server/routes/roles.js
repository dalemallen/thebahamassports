import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false // ✅ required for Render and Heroku
  }
});

router.get('/roles', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM roles ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error', details: err.message });
  }
});

export default router;
