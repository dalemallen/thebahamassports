
import pool from '../db/index.js';
import { handleError } from '../utils/errorHandler.js';

export const getAllPlayerProfiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM player_profiles ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    handleError(err, req, res);
  }
};

export const getPlayerProfileById = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM player_profiles WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Player profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(err, req, res);
  }
};

export const createPlayerProfile = async (req, res) => {
  const { user_id, bio, photo, social_links, premium } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO player_profiles (user_id, bio, photo, social_links, premium)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, bio, photo, social_links, premium]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    handleError(err, req, res);
  }
};

export const updatePlayerProfile = async (req, res) => {
  const { bio, photo, social_links, premium } = req.body;
  try {
    const result = await pool.query(
      `UPDATE player_profiles SET bio = $1, photo = $2, social_links = $3, premium = $4 WHERE id = $5 RETURNING *`,
      [bio, photo, social_links, premium, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Player profile not found' });
    res.json(result.rows[0]);
  } catch (err) {
    handleError(err, req, res);
  }
};

export const deletePlayerProfile = async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM player_profiles WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Player profile not found' });
    res.json({ message: 'Player profile deleted' });
  } catch (err) {
    handleError(err, req, res);
  }
};
