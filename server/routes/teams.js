import express from "express";
import db from "../db/index.js";

const router = express.Router();

// GET all teams
router.get("/", async (req, res) => {
  try {
    const { sport, federation } = req.query;

    let query = `
      SELECT t.id, t.name, t.logo_url, f.name AS federation_name, s.name AS sport_name
      FROM teams t
      LEFT JOIN federations f ON t.federation_id = f.id
      LEFT JOIN sports s ON t.sport_id = s.id
    `;
    const conditions = [];
    const values = [];

    if (sport) {
      values.push(sport);
      conditions.push(`s.name ILIKE $${values.length}`);
    }

    if (federation) {
      values.push(federation);
      conditions.push(`f.name ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ");
    }

    query += ` ORDER BY t.name ASC`;

    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
});

// GET single team details
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      `
      SELECT 
        t.id,
        t.name,
        t.logo_url,
        f.name AS federation_name,
        s.name AS sport_name
      FROM teams t
      LEFT JOIN federations f ON t.federation_id = f.id
      LEFT JOIN sports s ON t.sport_id = s.id
      WHERE t.id = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching team:", err);
    res.status(500).json({ error: "Failed to fetch team" });
  }
});

export default router;
