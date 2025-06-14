import express from "express";
import pool from '../db/index.js';

const router = express.Router();

// GET all teams
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM teams WHERE deleted_at IS NULL');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single team details with players
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Get the team with federation and sport
    const teamQuery = `
      SELECT 
        t.id,
        t.name,
        t.logo_url,
        t.league_id,
        t.bracket_id,
        f.name AS federation_name,
        s.name AS sport_name
      FROM teams t
      LEFT JOIN federations f ON t.federation_id = f.id
      LEFT JOIN sports s ON t.sport_id = s.id
      WHERE t.id = $1
    `;
    const teamResult = await pool.query(teamQuery, [id]);

    if (teamResult.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    // Get the players for that team
    const playerQuery = `
      SELECT 
        id, 
        first_name, 
        last_name, 
        position, 
        jersey_number,
        is_captain,
        is_mvp
      FROM players 
      WHERE team_id = $1
    `;
    const playersResult = await pool.query(playerQuery, [id]);

    const team = {
      ...teamResult.rows[0],
      players: playersResult.rows,
    };

    res.json(team);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ error: "Failed to fetch team", details: err.message });
  }
});


export default router;
