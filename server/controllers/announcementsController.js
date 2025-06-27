// server/controllers/announcementsController.js
import pool from "../db/index.js";

const getAnnouncementsByTeam = async (req, res) => {
	const { teamId } = req.params;
	try {
		const result = await pool.query(
			`SELECT * FROM team_announcements WHERE team_id = $1 ORDER BY created_at DESC`,
			[teamId]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching team announcements:", err);
		res.status(500).json({ error: "Failed to fetch team announcements." });
	}
};

export default { getAnnouncementsByTeam };
