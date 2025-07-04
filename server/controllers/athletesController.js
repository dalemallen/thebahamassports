import pool from "../db/index.js";
import getUserIdFromAuth0 from "../utils/getUserIdFromAuth0.js";
import handleError from "../utils/errorHandler.js";

// Normalize integers
const normalizeInt = (value) => {
	const parsed = parseInt(value);
	return isNaN(parsed) ? null : parsed;
};

// Create or update athlete profile
const createOrUpdateAthleteProfile = async (req, res) => {
	try {
		const {
			user_id,
			birthdate,
			birthplace,
			height_cm,
			weight_kg,
			position,
			debut_year,
			caps,
			points,
			achievements,
			profile_picture,
			sport_id,
			nationality,
			age_group,
			preferred_side,
			is_mvp,
			is_verified,
			show_public,
			club_id,
		} = req.body;

		if (!user_id) {
			return res.status(400).json({ error: "Missing user_id" });
		}

		const existing = await pool.query(
			"SELECT 1 FROM athlete_profiles WHERE user_id = $1",
			[user_id]
		);

		if (existing.rows.length > 0) {
			await pool.query(
				`UPDATE athlete_profiles SET
					birthdate=$1, birthplace=$2, height_cm=$3, weight_kg=$4,
					position=$5, debut_year=$6, caps=$7, points=$8, achievements=$9,
					profile_picture=$10, sport_id=$11, nationality=$12, age_group=$13,
					preferred_side=$14, is_mvp=$15, is_verified=$16, show_public=$17, updated_at=NOW()
				WHERE user_id=$18`,
				[
					birthdate,
					birthplace,
					normalizeInt(height_cm),
					normalizeInt(weight_kg),
					position,
					normalizeInt(debut_year),
					normalizeInt(caps),
					normalizeInt(points),
					achievements,
					profile_picture,
					sport_id,
					nationality,
					age_group,
					preferred_side,
					is_mvp,
					is_verified,
					show_public,
					user_id,
				]
			);
		} else {
			await pool.query(
				`INSERT INTO athlete_profiles (
					user_id, birthdate, birthplace, height_cm, weight_kg,
					position, debut_year, caps, points, achievements,
					profile_picture, sport_id, nationality, age_group,
					preferred_side, is_mvp, is_verified, show_public, created_at, updated_at
				) VALUES (
					$1, $2, $3, $4, $5,
					$6, $7, $8, $9, $10,
					$11, $12, $13, $14,
					$15, $16, $17, $18, NOW(), NOW()
				)`,
				[
					user_id,
					birthdate,
					birthplace,
					normalizeInt(height_cm),
					normalizeInt(weight_kg),
					position,
					normalizeInt(debut_year),
					normalizeInt(caps),
					normalizeInt(points),
					achievements,
					profile_picture,
					sport_id,
					nationality,
					age_group,
					preferred_side,
					is_mvp,
					is_verified,
					show_public,
				]
			);
		}

		res.json({ message: "Athlete profile created/updated" });
	} catch (err) {
		handleError(err, req, res);
	}
};

// Fetch athlete profile
const getAthleteProfile = async (req, res) => {
	try {
		const { id: user_id } = req.params;

		if (!user_id) {
			return res.status(400).json({ error: "Missing user_id parameter" });
		}

		const { rows } = await pool.query(
			`SELECT * FROM athlete_profiles WHERE user_id = $1`,
			[user_id]
		);

		if (!rows.length) {
			return res.status(404).json({ error: "Athlete profile not found" });
		}

		res.json(rows[0]);
	} catch (err) {
		console.error("Error fetching athlete profile:", err);
		handleError(err, req, res);
	}
};

// Get all athletes (with optional filters)
export const getAllAthletes = async (req, res) => {
	try {
		const {
			sport_id,
			federation_id,
			team_id,
			is_verified,
			is_mvp,
			search,
			limit = 50,
			offset = 0,
		} = req.query;

		const filters = [];
		const values = [];
		let idx = 1;

		if (team_id) {
			filters.push(
				`u.id IN (SELECT user_id FROM team_players WHERE team_id = $${idx++})`
			);
			values.push(team_id);
		}

		if (federation_id) {
			filters.push(`ap.federation_id = $${idx++}`);
			values.push(federation_id);
		}

		if (sport_id) {
			filters.push(`ap.sport_id = $${idx++}`);
			values.push(sport_id);
		}

		if (is_verified) {
			filters.push(`ap.is_verified = true`);
		}

		if (is_mvp) {
			filters.push(`ap.is_mvp = true`);
		}

		if (search) {
			filters.push(`(u.first_name ILIKE $${idx} OR u.last_name ILIKE $${idx})`);
			values.push(`%${search}%`);
			idx++;
		}

		const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

		const result = await pool.query(
			`SELECT u.id, u.first_name, u.last_name, ap.*
			FROM users u
			JOIN athlete_profiles ap ON u.id = ap.user_id
			${whereClause}
			ORDER BY u.last_name
			LIMIT $${idx++} OFFSET $${idx++}`,
			[...values, limit, offset]
		);

		res.json(result.rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athletes in a team
export const getAthletesByTeam = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`SELECT u.*, ap.* 
			 FROM users u 
			 JOIN athlete_profiles ap ON u.id = ap.user_id 
			 JOIN team_players tp ON tp.user_id = u.id 
			 WHERE tp.team_id = $1`,
			[req.params.teamId]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athlete stats
export const getAthleteStats = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM player_stats WHERE user_id=$1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Deactivate athlete
export const deactivateAthlete = async (req, res) => {
	try {
		await pool.query("UPDATE users SET deleted_at=NOW() WHERE id=$1", [
			req.params.id,
		]);
		res.json({ message: "Athlete deactivated" });
	} catch (err) {
		handleError(err, req, res);
	}
};

// Add athlete highlight
export const addAthleteHighlight = async (req, res) => {
	try {
		const { media_url, description, title } = req.body;
		await pool.query(
			`INSERT INTO player_highlights (user_id, media_url, description, title, created_at)
			 VALUES ($1, $2, $3, $4, NOW())`,
			[req.params.id, media_url, description, title]
		);
		res.status(201).json({ message: "Highlight added" });
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athlete highlights
export const getAthleteHighlights = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM player_highlights WHERE user_id=$1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athlete attendance
export const getAthleteAttendance = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM attendance WHERE user_id=$1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get top athletes (by stat_summary or points)
export const getTopAthletes = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`SELECT u.id, u.first_name, u.last_name, ap.*
			FROM users u
			JOIN athlete_profiles ap ON u.id = ap.user_id
			WHERE ap.is_mvp=true OR ap.is_verified=true
			ORDER BY ap.points DESC
			LIMIT 10`
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athlete’s team history
export const getAthleteTeamHistory = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM team_players WHERE user_id=$1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

// Get athlete by ID
export const getAthleteById = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`SELECT u.*, ap.*
			FROM users u
			JOIN athlete_profiles ap ON u.id = ap.user_id
			WHERE u.id=$1`,
			[req.params.id]
		);

		if (!rows.length) {
			return res.status(404).json({ error: "Athlete not found" });
		}

		res.json(rows[0]);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteLeaderboard = async (req, res) => {
	try {
		const { sortBy = "points", limit = 10 } = req.query;
		const validSorts = ["points", "first_name", "last_name"];
		const sort = validSorts.includes(sortBy) ? sortBy : "points";

		const { rows } = await pool.query(
			`
      SELECT u.id, u.first_name, u.last_name, COALESCE(SUM(ps.points_scored), 0) AS points
      FROM users u
      JOIN player_stats ps ON u.id = ps.user_id
      GROUP BY u.id
      ORDER BY ${sort} DESC
      LIMIT $1
    `,
			[limit]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const assignAthleteRole = async (req, res) => {
	try {
		const { user_id, team_id, role } = req.body;
		await pool.query(
			`INSERT INTO team_roles (user_id, team_id, role)
      VALUES ($1, $2, $3) ON CONFLICT (user_id, team_id)
      DO UPDATE SET role = EXCLUDED.role`,
			[user_id, team_id, role]
		);
		res.json({ message: "Role assigned" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteTrainingHistory = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM training_logs WHERE user_id = $1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const updateAthleteAvailability = async (req, res) => {
	try {
		const { availability } = req.body;
		await pool.query(
			"UPDATE athlete_profiles SET availability = $1 WHERE user_id = $2",
			[availability, req.params.id]
		);
		res.json({ message: "Availability updated" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteAwards = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM player_awards WHERE user_id = $1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const flagAthleteForReview = async (req, res) => {
	try {
		const { reason, flagged_by } = req.body;
		await pool.query(
			"INSERT INTO player_flags (user_id, reason, flagged_by) VALUES ($1, $2, $3)",
			[req.params.id, reason, flagged_by]
		);
		res.status(201).json({ message: "Athlete flagged for review" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteNotes = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM player_notes WHERE user_id = $1 AND deleted_at IS NULL",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const compareAthletes = async (req, res) => {
	try {
		const { athleteA, athleteB } = req.query;
		const { rows } = await pool.query(
			"SELECT * FROM player_stats WHERE user_id = $1 OR user_id = $2",
			[athleteA, athleteB]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteMediaGallery = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT * FROM player_highlights WHERE user_id = $1 AND deleted_at IS NULL",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteFullProfile = async (req, res) => {
	try {
		const { rows } = await pool.query(
			`
      SELECT u.*, a.*, ps.*, pa.*, aw.*
      FROM users u
      JOIN athlete_profiles a ON u.id = a.user_id
      LEFT JOIN player_stats ps ON u.id = ps.user_id
      LEFT JOIN attendance pa ON u.id = pa.user_id
      LEFT JOIN player_awards aw ON u.id = aw.user_id
      WHERE u.id = $1
    `,
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const reportAthleteMisconduct = async (req, res) => {
	try {
		const { reported_by, reason } = req.body;
		await pool.query(
			"INSERT INTO player_misconduct_reports (user_id, reported_by, reason) VALUES ($1, $2, $3)",
			[req.params.id, reported_by, reason]
		);
		res.status(201).json({ message: "Misconduct reported" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const followAthlete = async (req, res) => {
	try {
		const { follower_id } = req.body;
		await pool.query(
			"INSERT INTO player_followers (user_id, follower_id) VALUES ($1, $2)",
			[req.params.id, follower_id]
		);
		res.status(201).json({ message: "Athlete followed" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const unfollowAthlete = async (req, res) => {
	try {
		const { follower_id } = req.body;
		await pool.query(
			"DELETE FROM player_followers WHERE user_id = $1 AND follower_id = $2",
			[req.params.id, follower_id]
		);
		res.json({ message: "Athlete unfollowed" });
	} catch (err) {
		handleError(err, req, res);
	}
};

const getFollowers = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT u.id, u.first_name, u.last_name FROM users u JOIN player_followers pf ON u.id = pf.follower_id WHERE pf.user_id = $1",
			[req.params.id]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthleteCalendarAvailability = async (req, res) => {
	try {
		const { rows } = await pool.query(
			"SELECT availability FROM athlete_profiles WHERE user_id = $1",
			[req.params.id]
		);
		res.json(rows[0]);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getTopAthletesByStat = async (req, res) => {
	try {
		const { stat = "points_scored", limit = 10 } = req.query;
		const { rows } = await pool.query(
			`
      SELECT u.id, u.first_name, u.last_name, ps.${stat}
      FROM users u JOIN player_stats ps ON u.id = ps.user_id
      ORDER BY ps.${stat} DESC
      LIMIT $1
    `,
			[limit]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

const getAthletesByFederation = async (req, res) => {
	try {
		const { federationId } = req.params;
		const { rows } = await pool.query(
			`SELECT u.id AS user_id, u.first_name, u.last_name, a.position, a.points
		 FROM users u
		 JOIN athlete_profiles a ON u.id = a.user_id
		 WHERE a.federation_id = $1`,
			[federationId]
		);
		res.json(rows);
	} catch (err) {
		handleError(err, req, res);
	}
};

export default {
	createOrUpdateAthleteProfile,
	getAthleteProfile,
	getAllAthletes,
	getAthletesByTeam,
	getAthleteStats,
	deactivateAthlete,
	addAthleteHighlight,
	getAthleteHighlights,
	getAthleteAttendance,
	getTopAthletes,
	getAthleteTeamHistory,
	getAthleteById,
	getAthleteLeaderboard,
	assignAthleteRole,
	getAthleteTrainingHistory,
	updateAthleteAvailability,
	getAthleteAwards,
	flagAthleteForReview,
	getAthleteNotes,
	compareAthletes,
	getAthleteMediaGallery,
	getAthleteFullProfile,
	reportAthleteMisconduct,
	followAthlete,
	unfollowAthlete,
	getFollowers,
	getAthleteCalendarAvailability,
	getTopAthletesByStat,
	getAthletesByFederation,
};
