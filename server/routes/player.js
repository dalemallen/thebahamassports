// backend/routes/player.js
import express from "express";
import pool from "../db/index.js";

const router = express.Router();

// Get all players
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM players");
    res.json(result.rows);
    console.log('result.rows: ', result.rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch players", details: err.message });
  }
});

// Get player by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM players WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch player", details: err.message });
  }
});

// Create a new player (with validation)
router.post("/", async (req, res) => {
  const { first_name, last_name, bracket, team_id, premium } = req.body;

  if (/\d/.test(first_name) || /\d/.test(last_name)) {
    return res.status(400).json({ error: "Player names cannot contain numbers" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO players (first_name, last_name, bracket, team_id, premium)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [first_name, last_name, bracket, team_id, premium]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to create player", details: err.message });
  }
});

export default router;
