import { pl } from "@faker-js/faker";
import pool from "../db/index.js";
import handleError from "../utils/errorHandler.js";

// === Core ===
// server/controllers/playerController.js

const getAllPlayers = async (req, res) => {
	try {
		const {
			sport_id,
			team_id,
			federation_id,
			position,
			gender,
			verified,
			mvp,
			age_group,
			search,
			limit = 50,
			offset = 0,
		} = req.query;

		const filters = [];
		const values = [];
		let idx = 1;

		// Filter by team (via team_players table)
		if (team_id) {
			filters.push(
				`u.id IN (SELECT user_id FROM team_players WHERE team_id = $${idx++})`
			);
			values.push(team_id);
		}

		// Filter by federation (via athlete_profiles.club_team matching team name)
		if (federation_id) {
			filters.push(`
				ap.club_team IN (
					SELECT name FROM teams WHERE federation_id = $${idx++}
				)
			`);
			values.push(federation_id);
		}

		// Filter by sport
		if (sport_id) {
			filters.push(`ap.sport_id = $${idx++}`);
			values.push(sport_id);
		}

		// Position from player_profiles
		if (position) {
			filters.push(`pp.position ILIKE $${idx++}`);
			values.push(`%${position}%`);
		}

		// Gender from users
		if (gender) {
			filters.push(`u.gender = $${idx++}`);
			values.push(gender);
		}

		// Verified / MVP / Age Group from athlete_profiles
		if (verified) {
			filters.push(`ap.is_verified = true`);
		}
		if (mvp) {
			filters.push(`ap.is_mvp = true`);
		}
		if (age_group) {
			filters.push(`ap.age_group = $${idx++}`);
			values.push(age_group);
		}

		// Search name
		if (search && search.trim() !== "") {
			filters.push(`(u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx})`);
			values.push(`%${search.trim()}%`);
			idx++;
		}

		const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

		const query = `
			SELECT u.id, u.first_name, u.last_name,
				   pp.photo, pp.position,
				   ap.age_group, ap.club_team, ap.nationality,
				   ap.is_verified, ap.is_mvp,
				   ph.media_url AS highlight_video
			FROM users u
			JOIN player_profiles pp ON u.id = pp.user_id
			LEFT JOIN athlete_profiles ap ON u.id = ap.user_id
			LEFT JOIN player_highlights ph ON u.id = ph.user_id
			${whereClause}
		GROUP BY u.id, u.first_name, u.last_name,
         pp.photo, pp.position,
         ap.age_group, ap.club_team, ap.nationality, ap.is_verified, ap.is_mvp,
         ph.media_url
			ORDER BY u.last_name ASC
			LIMIT $${idx++} OFFSET $${idx++}
		`;

		values.push(limit);
		values.push(offset);

		const result = await pool.query(query, values);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayersByTeam = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT u.*, pp.* FROM users u JOIN player_profiles pp ON u.id = pp.user_id JOIN team_players tp ON tp.user_id = u.id WHERE tp.team_id = $1",
			[req.params.teamId]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};
const getPlayersByFederation = async (req, res) => {
	console.log("get players");
	try {
		const result = await pool.query(
			`SELECT 
  u.id AS user_id,
  u.first_name,
  u.last_name,
  u.email,
  pp.position,
  t.name AS team_name,
  t.federation_id
FROM player_profiles pp
JOIN users u ON u.id = pp.user_id
JOIN teams t ON pp.team_id = t.id
WHERE t.federation_id = $1
GROUP BY u.id, u.first_name, u.last_name, u.email, pp.position, t.name, t.federation_id;
`,
			[req.params.federationId]
		);

		res.json(result.rows);
		console.log("result.rows: ", result.rows);
	} catch (err) {
		console.error("Error fetching federation players:", err);
		handleError(err, req, res);
	}
};

const evaluatePlayer = async (req, res) => {
	const { evaluator_id, user_id, feedback, score } = req.body;
	try {
		await pool.query(
			`INSERT INTO player_evaluations (evaluator_id, user_id, feedback, score)
       VALUES ($1, $2, $3, $4)`,
			[evaluator_id, user_id, feedback, score]
		);
		res.status(201).json({ message: "Evaluation submitted" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerStats = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM player_stats WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const deactivatePlayer = async (req, res) => {
	try {
		await pool.query("UPDATE users SET deleted_at = NOW() WHERE id = $1", [
			req.params.id,
		]);
		res.json({ message: "Player deactivated" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerLeaderboard = async (req, res) => {
	const { sortBy = "points", limit = 10 } = req.query;
	const validSorts = ["points", "first_name", "last_name"];
	const sort = validSorts.includes(sortBy) ? sortBy : "points";

	try {
		// Get all premium users and their stat
		const premium = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, u.premium, COALESCE(SUM(ps.points_scored), 0) AS points
      FROM users u
      JOIN player_stats ps ON u.id = ps.user_id
      WHERE u.premium = true
      GROUP BY u.id
    `);

		// Get top non-premium user (by points)
		const topNonPremium = await pool.query(`
      SELECT u.id, u.first_name, u.last_name, u.premium, COALESCE(SUM(ps.points_scored), 0) AS points
      FROM users u
      JOIN player_stats ps ON u.id = ps.user_id
      WHERE u.premium = false
      GROUP BY u.id
      ORDER BY points DESC
      LIMIT 1
    `);

		// Combine and deduplicate
		const combined = [...premium.rows];

		if (
			topNonPremium.rows.length > 0 &&
			!combined.find((p) => p.id === topNonPremium.rows[0].id)
		) {
			combined.push(topNonPremium.rows[0]);
		}

		// Sort
		const sorted = combined.sort((a, b) => {
			if (sort === "first_name" || sort === "last_name") {
				return a[sort].localeCompare(b[sort]);
			}
			return b[sort] - a[sort];
		});

		// Flag top overall player
		const topId = sorted[0]?.id;
		const final = sorted.slice(0, limit).map((p) => ({
			...p,
			is_top_overall: p.id === topId,
		}));

		res.json(final);
	} catch (err) {
		handleError(err, req, res);
	}
};

const assignPlayerRole = async (req, res) => {
	const { user_id, team_id, role } = req.body;
	try {
		await pool.query(
			`INSERT INTO team_roles (user_id, team_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, team_id)
       DO UPDATE SET role = EXCLUDED.role`,
			[user_id, team_id, role]
		);
		res.json({ message: "Role assigned" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerAttendance = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM player_attendance WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerTrainingHistory = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM training_logs WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const updatePlayerAvailability = async (req, res) => {
	const { availability } = req.body;
	try {
		await pool.query(
			"UPDATE player_profiles SET availability = $1 WHERE user_id = $2",
			[availability, req.params.id]
		);
		res.json({ message: "Availability updated" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const addPlayerHighlight = async (req, res) => {
	const { media_url, description } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_highlights (user_id, media_url, description) VALUES ($1, $2, $3)",
			[req.params.id, media_url, description]
		);
		res.status(201).json({ message: "Highlight added" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerAwards = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM player_awards WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const flagPlayerForReview = async (req, res) => {
	const { reason, flagged_by } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_flags (user_id, reason, flagged_by) VALUES ($1, $2, $3)",
			[req.params.id, reason, flagged_by]
		);
		res.status(201).json({ message: "Player flagged for review" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerTeamHistory = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_players WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerNotes = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM player_notes WHERE user_id = $1 AND deleted_at IS NULL",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const comparePlayers = async (req, res) => {
	const { playerA, playerB } = req.query;
	try {
		const result = await pool.query(
			"SELECT * FROM player_stats WHERE user_id = $1 OR user_id = $2",
			[playerA, playerB]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const searchPlayers = async (req, res) => {
	const { query, limit = 20, offset = 0 } = req.query;
	try {
		const result = await pool.query(
			`SELECT u.*, pp.* FROM users u
       JOIN player_profiles pp ON u.id = pp.user_id
       WHERE u.first_name ILIKE $1 OR u.last_name ILIKE $1 OR pp.position ILIKE $1
       LIMIT $2 OFFSET $3`,
			[`%${query}%`, limit, offset]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Additional Advanced Features
const getPlayerMediaGallery = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM player_highlights WHERE user_id = $1 AND deleted_at IS NULL",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerFullProfile = async (req, res) => {
	try {
		const result = await pool.query(
			`SELECT u.*, pp.*, ps.*, pa.*, aw.*
       FROM users u
       JOIN player_profiles pp ON u.id = pp.user_id
       LEFT JOIN player_stats ps ON u.id = ps.user_id
       LEFT JOIN player_attendance pa ON u.id = pa.user_id
       LEFT JOIN player_awards aw ON u.id = aw.user_id
       WHERE u.id = $1`,
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const reportPlayerMisconduct = async (req, res) => {
	const { reported_by, reason } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_misconduct_reports (user_id, reported_by, reason) VALUES ($1, $2, $3)",
			[req.params.id, reported_by, reason]
		);
		res.status(201).json({ message: "Misconduct reported" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const followPlayer = async (req, res) => {
	const { follower_id } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_followers (user_id, follower_id) VALUES ($1, $2)",
			[req.params.id, follower_id]
		);
		res.status(201).json({ message: "Player followed" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const unfollowPlayer = async (req, res) => {
	const { follower_id } = req.body;
	try {
		await pool.query(
			"DELETE FROM player_followers WHERE user_id = $1 AND follower_id = $2",
			[req.params.id, follower_id]
		);
		res.json({ message: "Player unfollowed" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getFollowers = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT u.id, u.first_name, u.last_name FROM users u JOIN player_followers pf ON u.id = pf.follower_id WHERE pf.user_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerCalendarAvailability = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT availability FROM player_profiles WHERE user_id = $1",
			[req.params.id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getTopPlayersByStat = async (req, res) => {
	const { stat = "points_scored", limit = 10 } = req.query;
	try {
		const result = await pool.query(
			`SELECT u.id, u.first_name, u.last_name, ps.${stat} FROM users u
       JOIN player_stats ps ON u.id = ps.user_id
       ORDER BY ps.${stat} DESC
       LIMIT $1`,
			[limit]
		);
		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getPlayerById = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			`SELECT u.id, u.first_name, u.last_name, ap.*
       FROM users u
       JOIN athlete_profiles ap ON u.id = ap.user_id
       WHERE u.id = $1`,
			[id]
		);

		if (result.rowCount === 0) {
			return res.status(404).json({ error: "Player not found" });
		}

		res.json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching player:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default {
	getAllPlayers,
	getPlayersByTeam,
	getPlayersByFederation,
	evaluatePlayer,
	getPlayerStats,
	deactivatePlayer,
	getPlayerLeaderboard,
	assignPlayerRole,
	getPlayerAttendance,
	getPlayerTrainingHistory,
	updatePlayerAvailability,
	addPlayerHighlight,
	getPlayerAwards,
	flagPlayerForReview,
	getPlayerTeamHistory,
	getPlayerNotes,
	comparePlayers,
	searchPlayers,
	getPlayerMediaGallery,
	getPlayerFullProfile,
	reportPlayerMisconduct,
	followPlayer,
	unfollowPlayer,
	getFollowers,
	getPlayerCalendarAvailability,
	getTopPlayersByStat,
	getPlayerById,
};
