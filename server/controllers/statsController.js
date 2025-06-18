// server/controllers/statsController.js
import db from '../db/index.js';
export const getStatsBySport = async (req, res) => {
  const { sportId } = req.params;

  try {
    const result = await db.query(`
      SELECT 
        COUNT(DISTINCT players.id) AS total_players,
        COUNT(DISTINCT teams.id) AS total_teams
      FROM federations
      LEFT JOIN teams ON teams.federation_id = federations.id
      LEFT JOIN players ON players.team_id = teams.id
      WHERE federations.sport_id = $1
    `, [sportId]);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching sport stats:', err);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
