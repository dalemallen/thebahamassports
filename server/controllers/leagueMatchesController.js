import pool from "../db/index.js";

export const getAllLeagueMatches = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM league_matches ORDER BY match_date DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch league matches" });
  }
};

export const getLeagueMatchById = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM league_matches WHERE id = $1", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Match not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch match" });
  }
};

export const createLeagueMatch = async (req, res) => {
  const { league_id, home_team_id, away_team_id, match_date, location, score_home, score_away, status } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO league_matches
      (league_id, home_team_id, away_team_id, match_date, location, score_home, score_away, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [league_id, home_team_id, away_team_id, match_date, location, score_home, score_away, status]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create match" });
  }
};

export const updateLeagueMatch = async (req, res) => {
  const { id } = req.params;
  const { league_id, home_team_id, away_team_id, match_date, location, score_home, score_away, status } = req.body;
  try {
    const result = await pool.query(
      `UPDATE league_matches SET
      league_id = $1, home_team_id = $2, away_team_id = $3, match_date = $4,
      location = $5, score_home = $6, score_away = $7, status = $8
      WHERE id = $9 RETURNING *`,
      [league_id, home_team_id, away_team_id, match_date, location, score_home, score_away, status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Match not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update match" });
  }
};

export const deleteLeagueMatch = async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM league_matches WHERE id = $1 RETURNING *", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Match not found" });
    res.json({ message: "Match deleted", match: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete match" });
  }
};
