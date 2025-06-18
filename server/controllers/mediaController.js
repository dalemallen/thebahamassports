// server/controllers/mediaController.js
import pool from '../db/index.js';

export const getMediaHighlights = async (req, res) => {
  try {
    const { federationId } = req.params;
    const result = await pool.query(
      `SELECT title, highlight_date, media_url 
       FROM media_highlights 
       WHERE federation_id = $1 
       ORDER BY highlight_date DESC`,
      [federationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching media highlights:', err);
    res.status(500).json({ error: 'Failed to fetch media highlights' });
  }
};
