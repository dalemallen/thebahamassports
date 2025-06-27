import pool from "../db/index.js";
import { Parser } from "json2csv";

// === Core Team CRUD ===

const getAllTeams = async (req, res) => {
	const result = await pool.query(
		"SELECT * FROM teams WHERE deleted_at IS NULL"
	);
	res.json(result.rows);
};

const getTeamById = async (req, res) => {
	const teamId = parseInt(req.params.id, 10);
	if (isNaN(teamId)) {
		return res.status(400).json({ error: "Invalid team ID" });
	}

	console.log("THE REQUEST: ", req.params);
	const result = await pool.query("SELECT * FROM teams WHERE id = $1", [
		req.params.id,
	]);
	res.json(result.rows[0]);
};

const createTeam = async (req, res) => {
	const { name, sport_id, federation_id, created_by } = req.body;
	const result = await pool.query(
		"INSERT INTO teams (name, sport_id, federation_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *",
		[name, sport_id, federation_id, created_by]
	);
	res.status(201).json(result.rows[0]);
};

const updateTeam = async (req, res) => {
	const teamId = req.params.id;
	const updates = req.body;
	const fields = Object.keys(updates);
	const values = Object.values(updates);
	const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(", ");
	await pool.query(`UPDATE teams SET ${setClause} WHERE id = $1`, [
		teamId,
		...values,
	]);
	res.json({ message: "Team updated" });
};

const softDeleteTeam = async (req, res) => {
	await pool.query("UPDATE teams SET deleted_at = NOW() WHERE id = $1", [
		req.params.id,
	]);
	res.json({ message: "Team soft-deleted" });
};

const getTeamsByFederation = async (req, res) => {
	const result = await pool.query(
		"SELECT * FROM teams WHERE federation_id = $1 AND deleted_at IS NULL",
		[req.params.id]
	);
	res.json(result.rows);
};

const getTeamsByCreator = async (req, res) => {
	const result = await pool.query(
		"SELECT * FROM teams WHERE created_by = $1 AND deleted_at IS NULL",
		[req.params.userId]
	);
	res.json(result.rows);
};

// === Players & Invites ===

const getTeamPlayers = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await pool.query(
			`
      SELECT 
        p.user_id,                   -- ✅ this is the unique ID you need
        u.first_name, 
        u.last_name, 
        u.email,
        p.position,
        p.jersey_number
      FROM player_profiles p
      JOIN users u ON u.id = p.user_id
      WHERE p.team_id = $1
    `,
			[id]
		);

		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching players for team:", err);
		res.status(500).json({ error: "Failed to fetch players for team" });
	}
};

const joinTeamByInviteCode = async (req, res) => {
	const { invite_code, user_id } = req.body;
	const invite = await pool.query(
		"SELECT * FROM team_invites WHERE invite_code = $1 AND status = $2",
		[invite_code, "pending"]
	);

	if (invite.rows.length === 0) {
		return res.status(404).json({ error: "Invalid or expired invite code" });
	}

	await pool.query(
		"UPDATE player_profiles SET team_id = $1 WHERE user_id = $2",
		[invite.rows[0].team_id, user_id]
	);

	await pool.query("UPDATE team_invites SET status = $1 WHERE id = $2", [
		"accepted",
		invite.rows[0].id,
	]);
	res.json({ message: "Joined team successfully" });
};

const removePlayerFromTeam = async (req, res) => {
	const { user_id } = req.body;
	await pool.query(
		"UPDATE player_profiles SET team_id = NULL WHERE user_id = $1 AND team_id = $2",
		[user_id, req.params.id]
	);
	res.json({ message: "Player removed from team" });
};

// === Stats, Announcements, Invites ===

const getTeamInvites = async (req, res) => {
	const result = await pool.query(
		`SELECT i.*, u.first_name, u.last_name FROM team_invites i
     JOIN users u ON u.id = i.user_id
     WHERE i.team_id = $1 AND i.status = 'pending'`,
		[req.params.id]
	);
	res.json(result.rows);
};

const getTeamStats = async (req, res) => {
	const { id } = req.params;
	console.log("req.params: ", req.params);
	console.log("id: ", id);
	const parsedId = parseInt(id);
	if (isNaN(parsedId)) {
		return res.status(400).json({ error: "Invalid team ID." });
	}
	try {
		const result = await pool.query(
			`SELECT COUNT(*) as total_matches,
				SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
				SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
				SUM(points_scored) as total_points
		 FROM team_stats WHERE team_id = $1`,
			[parsedId]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error("Error fetching team stats:", err);
		res.status(500).json({ error: "Failed to fetch team stats." });
	}
};

const createTeamAnnouncement = async (req, res) => {
	const { title, body, created_by } = req.body;
	await pool.query(
		"INSERT INTO announcements (team_id, title, body, created_by) VALUES ($1, $2, $3, $4)",
		[req.params.id, title, body, created_by]
	);
	res.status(201).json({ message: "Announcement created" });
};

const getTeamAnnouncements = async (req, res) => {
	const result = await pool.query(
		"SELECT * FROM announcements WHERE team_id = $1 ORDER BY created_at DESC",
		[req.params.id]
	);
	res.json(result.rows);
};

// === CSV Exports ===

const TeamRoster = async (req, res) => {
	const result = await pool.query(
		`
    SELECT u.first_name, u.last_name, u.email, p.position
    FROM player_profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.team_id = $1
  `,
		[req.params.id]
	);
	const csv = new Parser().parse(result.rows);
	res
		.header("Content-Type", "text/csv")
		.attachment("team_roster.csv")
		.send(csv);
};

const TeamSchedule = async (req, res) => {
	const result = await pool.query(
		`
    SELECT m.match_date,
           CASE WHEN m.home_team_id = $1 THEN away.name ELSE home.name END AS opponent,
           m.location, m.result
    FROM tournament_matches m
    LEFT JOIN teams home ON home.id = m.home_team_id
    LEFT JOIN teams away ON away.id = m.away_team_id
    WHERE m.home_team_id = $1 OR m.away_team_id = $1
    ORDER BY m.match_date
  `,
		[req.params.id]
	);
	const csv = new Parser({
		fields: ["match_date", "opponent", "location", "result"],
	}).parse(result.rows);
	res
		.header("Content-Type", "text/csv")
		.attachment("team_schedule.csv")
		.send(csv);
};

const TeamAnnouncements = async (req, res) => {
	const result = await pool.query(
		`
    SELECT title, body, created_by, created_at
    FROM announcements
    WHERE team_id = $1
    ORDER BY created_at DESC
  `,
		[req.params.id]
	);
	const csv = new Parser().parse(result.rows);
	res
		.header("Content-Type", "text/csv")
		.attachment("team_announcements.csv")
		.send(csv);
};

const PlayerPerformance = async (req, res) => {
	const result = await pool.query(
		`
    SELECT u.first_name || ' ' || u.last_name AS player_name,
           ps.matches_played, ps.goals, ps.assists, ps.yellow_cards, ps.red_cards
    FROM player_stats ps
    JOIN users u ON u.id = ps.user_id
    WHERE ps.team_id = $1
  `,
		[req.params.id]
	);
	const csv = new Parser().parse(result.rows);
	res
		.header("Content-Type", "text/csv")
		.attachment("player_performance.csv")
		.send(csv);
};

const TeamAttendance = async (req, res) => {
	const result = await pool.query(
		`
    SELECT u.first_name || ' ' || u.last_name AS player,
           a.attendance_date, a.status
    FROM attendance a
    JOIN users u ON u.id = a.user_id
    WHERE a.team_id = $1
    ORDER BY u.last_name, a.attendance_date
  `,
		[req.params.id]
	);

	const rows = result.rows;
	const grouped = {};
	const dateSet = new Set();

	rows.forEach(({ player, attendance_date, status }) => {
		dateSet.add(attendance_date);
		if (!grouped[player]) grouped[player] = {};
		grouped[player][attendance_date] = status;
	});

	const sortedDates = [...dateSet].sort();
	const csvData = Object.entries(grouped).map(([player, dates]) => {
		const row = { player };
		sortedDates.forEach((date) => (row[date] = dates[date] || "—"));
		return row;
	});

	const csv = new Parser({ fields: ["player", ...sortedDates] }).parse(csvData);
	res.header("Content-Type", "text/csv").attachment("attendance.csv").send(csv);
};

const TeamStats = async (req, res) => {
	const result = await pool.query(
		`
    SELECT COUNT(*) AS total_matches,
           SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins,
           SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS losses,
           SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) AS draws,
           SUM(points_scored) AS goals_scored
    FROM team_stats
    WHERE team_id = $1
  `,
		[req.params.id]
	);
	const csv = new Parser().parse([result.rows[0]]);
	res.header("Content-Type", "text/csv").attachment("team_stats.csv").send(csv);
};

const searchTeams = async (req, res) => {
	const { q } = req.query;

	if (!q || q.trim() === "") {
		return res.status(400).json({ error: "Search query is required" });
	}

	try {
		const result = await pool.query(
			`
      SELECT t.*, s.name AS sport_name, f.name AS federation_name
      FROM teams t
      LEFT JOIN sports s ON t.sport_id = s.id
      LEFT JOIN federations f ON t.federation_id = f.id
      WHERE
        LOWER(t.name) ILIKE $1 OR
        LOWER(s.name) ILIKE $1 OR
        LOWER(f.name) ILIKE $1
      AND t.deleted_at IS NULL
    `,
			[`%${q.toLowerCase()}%`]
		);

		res.json(result.rows);
	} catch (err) {
		console.error("searchTeams error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

const uploadTeamMedia = async (req, res) => {
	const teamId = req.params.id;
	const { logo_url, cover_image_url } = req.body;

	if (!logo_url && !cover_image_url) {
		return res
			.status(400)
			.json({ error: "At least one media URL must be provided" });
	}

	try {
		const updates = [];
		const values = [teamId];

		if (logo_url) {
			values.push(logo_url);
			updates.push(`logo_url = $${values.length}`);
		}

		if (cover_image_url) {
			values.push(cover_image_url);
			updates.push(`cover_image_url = $${values.length}`);
		}

		const query = `
      UPDATE teams
      SET ${updates.join(", ")}
      WHERE id = $1
      RETURNING *
    `;

		const result = await pool.query(query, values);
		res.json({ message: "Media updated", team: result.rows[0] });
	} catch (err) {
		console.error("uploadTeamMedia error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// === Team Role Management ===
const assignTeamRole = async (req, res) => {
	const { user_id, role } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_roles (team_id, user_id, role) VALUES ($1, $2, $3) ON CONFLICT (team_id, user_id) DO UPDATE SET role = $3",
			[req.params.id, user_id, role]
		);
		res.json({ message: "Role assigned" });
	} catch (err) {
		console.error("assignTeamRole error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamRoles = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_roles WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamRoles error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Custom Tags ===
const updateTeamTags = async (req, res) => {
	try {
		const { tags } = req.body;
		await pool.query("UPDATE teams SET tags = $1 WHERE id = $2", [
			tags,
			req.params.id,
		]);
		res.json({ message: "Tags updated" });
	} catch (err) {
		console.error("updateTeamTags error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Facility Management ===
const getTeamFacilities = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_facilities WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamFacilities error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const createTeamFacility = async (req, res) => {
	try {
		const { name, location, description } = req.body;
		await pool.query(
			"INSERT INTO team_facilities (team_id, name, location, description) VALUES ($1, $2, $3, $4)",
			[req.params.id, name, location, description]
		);
		res.status(201).json({ message: "Facility added" });
	} catch (err) {
		console.error("createTeamFacility error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Team Documents ===
const getTeamDocuments = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_documents WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamDocuments error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const uploadTeamDocument = async (req, res) => {
	try {
		const { name, url, uploaded_by } = req.body;
		await pool.query(
			"INSERT INTO team_documents (team_id, name, url, uploaded_by) VALUES ($1, $2, $3, $4)",
			[req.params.id, name, url, uploaded_by]
		);
		res.status(201).json({ message: "Document uploaded" });
	} catch (err) {
		console.error("uploadTeamDocument error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const deleteTeamDocument = async (req, res) => {
	try {
		await pool.query(
			"DELETE FROM team_documents WHERE id = $1 AND team_id = $2",
			[req.params.docId, req.params.id]
		);
		res.json({ message: "Document deleted" });
	} catch (err) {
		console.error("deleteTeamDocument error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const addTeamNote = async (req, res) => {
	try {
		const { note, created_by } = req.body;
		await pool.query(
			"INSERT INTO team_notes (team_id, note, created_by) VALUES ($1, $2, $3)",
			[req.params.id, note, created_by]
		);
		res.status(201).json({ message: "Note added" });
	} catch (err) {
		console.error("addTeamNote error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Team Messaging ===
const getTeamMessages = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_messages WHERE team_id = $1 ORDER BY created_at DESC",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamMessages error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const postTeamMessage = async (req, res) => {
	try {
		const { message, sent_by } = req.body;
		await pool.query(
			"INSERT INTO team_messages (team_id, message, sent_by) VALUES ($1, $2, $3)",
			[req.params.id, message, sent_by]
		);
		res.status(201).json({ message: "Message sent" });
	} catch (err) {
		console.error("postTeamMessage error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Availability ===
const getAvailability = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM availability WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getAvailability error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const setAvailability = async (req, res) => {
	try {
		const { user_id, date, status } = req.body;
		await pool.query(
			"INSERT INTO availability (team_id, user_id, date, status) VALUES ($1, $2, $3, $4) ON CONFLICT (team_id, user_id, date) DO UPDATE SET status = $4",
			[req.params.id, user_id, date, status]
		);
		res.status(201).json({ message: "Availability set" });
	} catch (err) {
		console.error("setAvailability error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 1. Team Calendar ===
const getTeamCalendar = async (req, res) => {
	try {
		const teamId = req.params.id;
		const [matches, trainings, availability] = await Promise.all([
			pool.query(
				"SELECT match_date AS date, location, result FROM tournament_matches WHERE home_team_id = $1 OR away_team_id = $1",
				[teamId]
			),
			pool.query("SELECT date, topic FROM team_trainings WHERE team_id = $1", [
				teamId,
			]),
			pool.query(
				"SELECT date, status, user_id FROM availability WHERE team_id = $1",
				[teamId]
			),
		]);

		res.json({
			matches: matches.rows,
			trainings: trainings.rows,
			availability: availability.rows,
		});
	} catch (err) {
		console.error("getTeamCalendar error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 2. Trainings ===
const scheduleTraining = async (req, res) => {
	const { date, topic, location } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_trainings (team_id, date, topic, location) VALUES ($1, $2, $3, $4)",
			[req.params.id, date, topic, location]
		);
		res.status(201).json({ message: "Training scheduled" });
	} catch (err) {
		console.error("scheduleTraining error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTrainings = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_trainings WHERE team_id = $1 ORDER BY training_date",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTrainings error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 3. Opponent History ===
const getTeamOpponents = async (req, res) => {
	try {
		const result = await pool.query(
			`
      SELECT DISTINCT 
        CASE 
          WHEN t.id = m.home_team_id THEN a.name
          ELSE h.name
        END AS opponent
      FROM tournament_matches m
      JOIN teams h ON m.home_team_id = h.id
      JOIN teams a ON m.away_team_id = a.id
      JOIN teams t ON t.id = $1
      WHERE m.home_team_id = $1 OR m.away_team_id = $1`,
			[req.params.id]
		);

		res.json(result.rows);
	} catch (err) {
		console.error("getTeamOpponents error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 4. Activity Log ===
const getActivityLog = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_activity_log WHERE team_id = $1 ORDER BY created_at DESC",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getActivityLog error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const uploadToGallery = async (req, res) => {
	try {
		const { uploaded_by, media_url, type, tags } = req.body;
		const { id } = req.params;
		const result = await pool.query(
			`INSERT INTO team_gallery (team_id, uploaded_by, media_url, type, tags) 
		 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[id, uploaded_by, media_url, type, tags]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// === 6. Request Verification ===
const requestTeamVerification = async (req, res) => {
	try {
		const { user_id, notes } = req.body;
		await pool.query(
			"INSERT INTO verifications (user_id, role, notes, status) VALUES ($1, $2, $3, $4)",
			[user_id, "team", notes, "pending"]
		);
		res.status(201).json({ message: "Verification request submitted" });
	} catch (err) {
		console.error("requestTeamVerification error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 7. Report Team Issue ===
const reportTeamIssue = async (req, res) => {
	const { reported_by, issue } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_reports (team_id, reported_by, issue) VALUES ($1, $2, $3)",
			[req.params.id, reported_by, issue]
		);
		res.status(201).json({ message: "Issue reported" });
	} catch (err) {
		console.error("reportTeamIssue error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 8. Recruitment Status ===
const getRecruitmentStatus = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT recruitment_status FROM teams WHERE id = $1",
			[req.params.id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error("getRecruitmentStatus error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const updateRecruitmentStatus = async (req, res) => {
	try {
		const { recruitment_status } = req.body;
		await pool.query("UPDATE teams SET recruitment_status = $1 WHERE id = $2", [
			recruitment_status,
			req.params.id,
		]);
		res.json({ message: "Recruitment status updated" });
	} catch (err) {
		console.error("updateRecruitmentStatus error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 9. Player Evaluation ===
const evaluatePlayer = async (req, res) => {
	const { player_id, evaluation, evaluated_by } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_evaluations (team_id, player_id, evaluation, evaluated_by) VALUES ($1, $2, $3, $4)",
			[req.params.id, player_id, evaluation, evaluated_by]
		);
		res.status(201).json({ message: "Evaluation submitted" });
	} catch (err) {
		console.error("evaluatePlayer error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === 10. Public Contact ===
const sendContactEmail = async (req, res) => {
	const { name, email, message } = req.body;
	try {
		// In production, send email via SendGrid/Mailgun/Nodemailer etc.
		console.log(`Contact Message to Team ${req.params.id}:`, {
			name,
			email,
			message,
		});
		res.json({ message: "Message sent to team contact" });
	} catch (err) {
		console.error("sendContactEmail error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === MVP ADDITIONS ===

// Soft deactivate team (e.g. inactive season)
const deactivateTeam = async (req, res) => {
	try {
		await pool.query("UPDATE teams SET is_active = false WHERE id = $1", [
			req.params.id,
		]);
		res.json({ message: "Team deactivated" });
	} catch (err) {
		console.error("deactivateTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const assignCaptain = async (req, res) => {
	const { player_id } = req.body;
	try {
		await pool.query("UPDATE players SET is_captain = true WHERE id = $1", [
			player_id,
		]);
		res.json({ message: "Captain assigned" });
	} catch (err) {
		console.error("assignCaptain error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const removeCaptain = async (req, res) => {
	const { player_id } = req.body;
	try {
		await pool.query("UPDATE players SET is_captain = false WHERE id = $1", [
			player_id,
		]);
		res.json({ message: "Captain removed" });
	} catch (err) {
		console.error("removeCaptain error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const requestJoinTeam = async (req, res) => {
	const { user_id, message } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_join_requests (team_id, user_id, message, status) VALUES ($1, $2, $3, $4)",
			[req.params.id, user_id, message, "pending"]
		);
		res.status(201).json({ message: "Join request sent" });
	} catch (err) {
		console.error("requestJoinTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamPublicProfile = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT id, name, sport_id, logo_url, cover_image_url FROM teams WHERE id = $1",
			[req.params.id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error("getTeamPublicProfile error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === NICE-TO-HAVE FEATURES ===

const exportSeasonSummary = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_stats WHERE team_id = $1",
			[req.params.id]
		);
		const csv = new Parser().parse(result.rows);
		res
			.header("Content-Type", "text/csv")
			.attachment("season_summary.csv")
			.send(csv);
	} catch (err) {
		console.error("exportSeasonSummary error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const assignAward = async (req, res) => {
	const { player_id, award_name } = req.body;
	try {
		await pool.query(
			"INSERT INTO player_awards (player_id, team_id, award_name) VALUES ($1, $2, $3)",
			[player_id, req.params.id, award_name]
		);
		res.status(201).json({ message: "Award assigned" });
	} catch (err) {
		console.error("assignAward error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamAnalytics = async (req, res) => {
	try {
		const result = await pool.query(
			`
      SELECT
        COUNT(*) FILTER (WHERE result = 'win') AS wins,
        COUNT(*) FILTER (WHERE result = 'loss') AS losses,
        COUNT(*) FILTER (WHERE result = 'draw') AS draws,
        AVG(points_scored) AS avg_points
      FROM team_stats WHERE team_id = $1
    `,
			[req.params.id]
		);
		res.json(result.rows[0]);
	} catch (err) {
		console.error("getTeamAnalytics error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const updateTeamCustomFields = async (req, res) => {
	const { custom_fields } = req.body; // JSON
	try {
		await pool.query("UPDATE teams SET custom_fields = $1 WHERE id = $2", [
			custom_fields,
			req.params.id,
		]);
		res.json({ message: "Custom fields updated" });
	} catch (err) {
		console.error("updateTeamCustomFields error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamsByUser = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM teams WHERE created_by = $1",
			[req.params.userId]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamsByUser error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const mergeTeams = async (req, res) => {
	const { source_team_id } = req.body;
	try {
		await pool.query("UPDATE players SET team_id = $1 WHERE team_id = $2", [
			req.params.id,
			source_team_id,
		]);
		await pool.query("DELETE FROM teams WHERE id = $1", [source_team_id]);
		res.json({ message: "Teams merged" });
	} catch (err) {
		console.error("mergeTeams error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const suspendTeam = async (req, res) => {
	try {
		await pool.query("UPDATE teams SET status = $1 WHERE id = $2", [
			"suspended",
			req.params.id,
		]);
		res.json({ message: "Team suspended" });
	} catch (err) {
		console.error("suspendTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === BONUS FEATURES ===

const getTeamPermissions = async (req, res) => {
	const { user_id } = req.query;
	try {
		const result = await pool.query(
			"SELECT role FROM team_roles WHERE team_id = $1 AND user_id = $2",
			[req.params.id, user_id]
		);
		res.json(result.rows[0] || { role: "none" });
	} catch (err) {
		console.error("getTeamPermissions error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const archiveTeam = async (req, res) => {
	try {
		await pool.query("UPDATE teams SET archived_at = NOW() WHERE id = $1", [
			req.params.id,
		]);
		res.json({ message: "Team archived" });
	} catch (err) {
		console.error("archiveTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const restoreTeam = async (req, res) => {
	try {
		await pool.query("UPDATE teams SET archived_at = NULL WHERE id = $1", [
			req.params.id,
		]);
		res.json({ message: "Team restored" });
	} catch (err) {
		console.error("restoreTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamTimeline = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_activity_log WHERE team_id = $1 ORDER BY created_at DESC",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamTimeline error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const addTeamDue = async (req, res) => {
	const { description, amount, due_date } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_dues (team_id, description, amount, due_date) VALUES ($1, $2, $3, $4)",
			[req.params.id, description, amount, due_date]
		);
		res.status(201).json({ message: "Due added" });
	} catch (err) {
		console.error("addTeamDue error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Payments & Revenue ===
const getTeamPayments = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_payments WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamPayments error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const getTeamRevenue = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_revenue WHERE team_id = $1",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamRevenue error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Player Add/Remove ===
const addPlayerToTeam = async (req, res) => {
	const { user_id } = req.body;
	try {
		await pool.query(
			"UPDATE player_profiles SET team_id = $1 WHERE user_id = $2",
			[req.params.id, user_id]
		);
		res.json({ message: "Player added to team" });
	} catch (err) {
		console.error("addPlayerToTeam error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const removePlayerById = async (req, res) => {
	try {
		await pool.query(
			"UPDATE player_profiles SET team_id = NULL WHERE user_id = $1 AND team_id = $2",
			[req.params.playerId, req.params.id]
		);
		res.json({ message: "Player removed from team" });
	} catch (err) {
		console.error("removePlayerById error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Join Request Approval ===
const respondToJoinRequest = async (req, res) => {
	const { status } = req.body; // 'approved' or 'rejected'
	try {
		await pool.query(
			"UPDATE team_join_requests SET status = $1 WHERE id = $2 AND team_id = $3",
			[status, req.params.requestId, req.params.id]
		);
		res.json({ message: `Join request ${status}` });
	} catch (err) {
		console.error("respondToJoinRequest error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Team Bulletin Board ===
const getTeamBulletin = async (req, res) => {
	try {
		const result = await pool.query(
			"SELECT * FROM team_bulletin WHERE team_id = $1 ORDER BY created_at DESC",
			[req.params.id]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("getTeamBulletin error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const postTeamBulletin = async (req, res) => {
	const { title, content, posted_by } = req.body;
	try {
		await pool.query(
			"INSERT INTO team_bulletin (team_id, title, content, posted_by) VALUES ($1, $2, $3, $4)",
			[req.params.id, title, content, posted_by]
		);
		res.status(201).json({ message: "Bulletin posted" });
	} catch (err) {
		console.error("postTeamBulletin error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Player Status & Position ===
const deactivatePlayer = async (req, res) => {
	try {
		await pool.query(
			"UPDATE players SET status = $1 WHERE id = $2 AND team_id = $3",
			["inactive", req.params.playerId, req.params.id]
		);
		res.json({ message: "Player marked inactive" });
	} catch (err) {
		console.error("deactivatePlayer error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

const setPlayerPosition = async (req, res) => {
	const { position } = req.body;
	try {
		await pool.query(
			"UPDATE players SET position = $1 WHERE id = $2 AND team_id = $3",
			[position, req.params.playerId, req.params.id]
		);
		res.json({ message: "Player position updated" });
	} catch (err) {
		console.error("setPlayerPosition error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === QR Code Endpoint (placeholder logic) ===
const getTeamQRCode = async (req, res) => {
	try {
		const qrLink = `https://thebahamassports.com/teams/${req.params.id}/join`;
		res.json({
			qr_url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
				qrLink
			)}`,
		});
	} catch (err) {
		console.error("getTeamQRCode error:", err);
		res.status(500).json({ error: "Server error" });
	}
};

// === Final Additions to TeamsController ===

const getTeamEquipment = async (req, res) => {
	res.json({ message: "List of team equipment" });
};

const addTeamEquipment = async (req, res) => {
	res.json({ message: "Team equipment added" });
};

const getTeamTransport = async (req, res) => {
	res.json({ message: "List of team transportation plans" });
};

const addTeamTransport = async (req, res) => {
	res.json({ message: "Transportation plan created" });
};

const getTeamMeals = async (req, res) => {
	res.json({ message: "List of team meal plans" });
};

const addTeamMeal = async (req, res) => {
	res.json({ message: "Meal added to plan" });
};

const getTeamMedia = async (req, res) => {
	res.json({ message: "List of team media items" });
};

const getTeamSponsors = async (req, res) => {
	res.json({ message: "List of team sponsors and details" });
};

const addTeamSponsor = async (req, res) => {
	res.json({ message: "Sponsor assigned to team" });
};

const getTeamTrainings = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM team_trainings WHERE team_id = $1 ORDER BY training_date ASC",
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getRecentMatches = async (req, res) => {
	try {
		const { id } = req.params;
		const leagueMatches = await pool.query(
			`SELECT * FROM league_matches WHERE (home_team_id = $1 OR away_team_id = $1) AND match_date < NOW() ORDER BY match_date DESC LIMIT 5`,
			[id]
		);
		const tournamentMatches = await pool.query(
			`SELECT * FROM tournament_matches WHERE (home_team_id = $1 OR away_team_id = $1) AND match_date < NOW() ORDER BY match_date DESC LIMIT 5`,
			[id]
		);
		res.json({
			leagueMatches: leagueMatches.rows,
			tournamentMatches: tournamentMatches.rows,
		});
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getAttendance = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM attendance WHERE team_id = $1 ORDER BY attendance_date DESC",
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const createAttendance = async (req, res) => {
	try {
		const { user_id, attendance_date, status } = req.body;
		const { id } = req.params;
		const result = await pool.query(
			`INSERT INTO attendance (team_id, user_id, attendance_date, status) 
		 VALUES ($1, $2, $3, $4) RETURNING *`,
			[id, user_id, attendance_date, status]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};
// === 5. Media Gallery ===
const getGallery = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM team_gallery WHERE team_id = $1 ORDER BY created_at DESC",
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getDocuments = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM team_documents WHERE team_id = $1 ORDER BY created_at DESC",
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const uploadDocument = async (req, res) => {
	try {
		const { doc_url, title, type } = req.body;
		const { id } = req.params;
		const result = await pool.query(
			`INSERT INTO team_documents (team_id, doc_url, title, type) 
		 VALUES ($1, $2, $3, $4) RETURNING *`,
			[id, doc_url, title, type]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getTeamDues = async (req, res) => {
	try {
		const { id } = req.params;
		const dues = await pool.query(
			"SELECT * FROM team_dues WHERE team_id = $1",
			[id]
		);
		const payments = await pool.query(
			`SELECT * FROM team_payments WHERE due_id IN (SELECT id FROM team_dues WHERE team_id = $1)`,
			[id]
		);
		res.json({ dues: dues.rows, payments: payments.rows });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const getTeamNotes = async (req, res) => {
	try {
		const { id } = req.params;
		const result = await pool.query(
			"SELECT * FROM team_notes WHERE team_id = $1 ORDER BY created_at DESC",
			[id]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

const createTeamNote = async (req, res) => {
	try {
		const { created_by, note } = req.body;
		const { id } = req.params;
		const result = await pool.query(
			`INSERT INTO team_notes (team_id, created_by, note) 
		 VALUES ($1, $2, $3) RETURNING *`,
			[id, created_by, note]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
};

// GET combined schedule (trainings + matches)
const getTeamSchedule = async (req, res) => {
	const teamId = req.params.id;
	try {
		const [trainings, leagueMatches, tournamentMatches] = await Promise.all([
			db.any(
				"SELECT * FROM team_trainings WHERE team_id = $1 AND deleted_at IS NULL",
				[teamId]
			),
			db.any(
				"SELECT * FROM league_matches WHERE (home_team_id = $1 OR away_team_id = $1) AND deleted_at IS NULL",
				[teamId]
			),
			db.any(
				"SELECT * FROM tournament_matches WHERE (home_team_id = $1 OR away_team_id = $1) AND deleted_at IS NULL",
				[teamId]
			),
		]);
		res.json({ trainings, leagueMatches, tournamentMatches });
	} catch (err) {
		console.error("Schedule fetch error:", err);
		res.status(500).json({ error: "Failed to fetch schedule" });
	}
};

// TRAININGS
const createTraining = async (req, res) => {
	const teamId = req.params.id;
	const { training_date, focus, location, notes } = req.body;
	try {
		const training = await db.one(
			`INSERT INTO team_trainings (team_id, training_date, focus, location, notes)
		 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[teamId, training_date, focus, location, notes]
		);
		res.status(201).json(training);
	} catch (err) {
		console.error("Create training error:", err);
		res.status(500).json({ error: "Failed to create training" });
	}
};

const deleteTraining = async (req, res) => {
	const { trainingId } = req.params;
	try {
		await db.none(
			`UPDATE team_trainings SET deleted_at = NOW() WHERE id = $1`,
			[trainingId]
		);
		res.sendStatus(204);
	} catch (err) {
		console.error("Delete training error:", err);
		res.status(500).json({ error: "Failed to delete training" });
	}
};

// TRYOUTS
const getTryouts = async (req, res) => {
	try {
		const teamId = req.params.id;
		const tryouts = await db.any(
			"SELECT * FROM team_tryouts WHERE team_id = $1",
			[teamId]
		);
		res.json(tryouts);
	} catch (err) {
		console.error("Get tryouts error:", err);
		res.status(500).json({ error: "Failed to fetch tryouts" });
	}
};

const createTryout = async (req, res) => {
	const teamId = req.params.id;
	const { tryout_date, location, notes, age_group } = req.body;
	try {
		const tryout = await db.one(
			`INSERT INTO team_tryouts (team_id, tryout_date, location, notes, age_group)
		 VALUES ($1, $2, $3, $4, $5) RETURNING *`,
			[teamId, tryout_date, location, notes, age_group]
		);
		res.status(201).json(tryout);
	} catch (err) {
		console.error("Create tryout error:", err);
		res.status(500).json({ error: "Failed to create tryout" });
	}
};

const updateTryout = async (req, res) => {
	const { id } = req.params;
	const { tryout_date, location, notes, age_group } = req.body;
	try {
		const updated = await db.one(
			`UPDATE team_tryouts
		 SET tryout_date = $2, location = $3, notes = $4, age_group = $5
		 WHERE id = $1 RETURNING *`,
			[id, tryout_date, location, notes, age_group]
		);
		res.json(updated);
	} catch (err) {
		console.error("Update tryout error:", err);
		res.status(500).json({ error: "Failed to update tryout" });
	}
};

const deleteTryout = async (req, res) => {
	const { id } = req.params;
	try {
		await db.none(`DELETE FROM team_tryouts WHERE id = $1`, [id]);
		res.sendStatus(204);
	} catch (err) {
		console.error("Delete tryout error:", err);
		res.status(500).json({ error: "Failed to delete tryout" });
	}
};

const saveDraft = async (req, res) => {
	const {
		user_id,
		name,
		location,
		ageGroup,
		gender,
		coachNames,
		federation_id,
		logo_url,
		cover_image_url,
	} = req.body;

	if (!user_id || !name || !federation_id) {
		return res.status(400).json({ error: "Missing required fields." });
	}

	try {
		const result = await pool.query(
			`INSERT INTO teams (
		  user_id,
		  name,
		  location,
		  age_group,
		  gender,
		  coach_names,
		  federation_id,
		  logo_url,
		  cover_image_url
		) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
		RETURNING *`,
			[
				user_id,
				name,
				location || null,
				ageGroup || null,
				gender || null,
				coachNames || [],
				federation_id,
				logo_url || null,
				cover_image_url || null,
			]
		);

		res.status(201).json(result.rows[0]);
	} catch (err) {
		console.error("Error saving team draft:", err);
		res.status(500).json({ error: "Failed to save draft." });
	}
};

const getTeamRoster = async (req, res) => {
	const { teamId } = req.params;
	console.log("teamId: ", teamId);
	const parsedId = parseInt(teamId);
	if (isNaN(parsedId)) {
		return res.status(400).json({ error: "Invalid team ID." });
	}

	try {
		const result = await pool.query(
			`SELECT u.id, u.first_name, u.last_name, pr.position, pr.jersey_number
		 FROM users u
		 JOIN player_profiles pr ON pr.user_id = u.id
		 WHERE pr.team_id = $1 AND pr.deleted_at IS NULL`,
			[parsedId]
		);
		res.json(result.rows);
	} catch (err) {
		console.error("Error fetching team roster:", err);
		res.status(500).json({ error: "Failed to fetch roster." });
	}
};

export default {
	getAllTeams,
	getTeamById,
	createTeam,
	updateTeam,
	softDeleteTeam,
	getTeamsByFederation,
	getTeamsByCreator,
	getTeamPlayers,
	joinTeamByInviteCode,
	removePlayerFromTeam,
	getTeamInvites,
	getTeamStats,
	createTeamAnnouncement,
	getTeamAnnouncements,
	searchTeams,
	uploadTeamMedia,
	TeamRoster,
	TeamSchedule,
	TeamAnnouncements,
	PlayerPerformance,
	TeamAttendance,
	TeamStats,
	assignTeamRole,
	getTeamRoles,
	updateTeamTags,
	getTeamFacilities,
	createTeamFacility,
	getTeamDocuments,
	uploadTeamDocument,
	deleteTeamDocument,
	getTeamNotes,
	addTeamNote,
	getTeamMessages,
	postTeamMessage,
	getAvailability,
	setAvailability,
	getTeamCalendar,
	scheduleTraining,
	getTrainings,
	getTeamOpponents,
	getActivityLog,
	getGallery,
	uploadToGallery,
	requestTeamVerification,
	reportTeamIssue,
	getRecruitmentStatus,
	updateRecruitmentStatus,
	evaluatePlayer,
	sendContactEmail,
	deactivateTeam,
	assignCaptain,
	removeCaptain,
	requestJoinTeam,
	getTeamPublicProfile,
	exportSeasonSummary,
	assignAward,
	getTeamAnalytics,
	updateTeamCustomFields,
	getTeamsByUser,
	mergeTeams,
	suspendTeam,
	getTeamPermissions,
	archiveTeam,
	restoreTeam,
	getTeamTimeline,

	addTeamDue,
	getTeamPayments,
	getTeamRevenue,
	addPlayerToTeam,
	removePlayerById,
	deactivatePlayer,
	setPlayerPosition,
	respondToJoinRequest,
	getTeamBulletin,
	postTeamBulletin,
	getTeamQRCode,
	getTeamEquipment,
	addTeamEquipment,
	getTeamTransport,
	addTeamTransport,
	getTeamMeals,
	addTeamMeal,
	getTeamMedia,
	getTeamSponsors,
	addTeamSponsor,
	getTeamTrainings,
	getRecentMatches,
	getAttendance,
	createAttendance,
	getDocuments,
	uploadDocument,
	getTeamDues,
	getTeamNotes,
	createTeamNote,
	getTeamSchedule,
	createTraining,
	deleteTraining,
	getTryouts,
	createTryout,
	updateTryout,
	deleteTryout,
	saveDraft,
	getTeamRoster,
};
