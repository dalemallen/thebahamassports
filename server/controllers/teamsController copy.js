
import pool from '../db/index.js';
import { Parser } from 'json2csv';

// === Core Team CRUD ===

const getAllTeams = async (req, res) => {
  const result = await pool.query('SELECT * FROM teams WHERE deleted_at IS NULL');
  res.json(result.rows);
};

const getTeamById = async (req, res) => {
  const result = await pool.query('SELECT * FROM teams WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
};

const createTeam = async (req, res) => {
  const { name, sport_id, federation_id, created_by } = req.body;
  const result = await pool.query(
    'INSERT INTO teams (name, sport_id, federation_id, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, sport_id, federation_id, created_by]
  );
  res.status(201).json(result.rows[0]);
};

const updateTeam = async (req, res) => {
  const teamId = req.params.id;
  const updates = req.body;
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');

  await pool.query(`UPDATE teams SET ${setClause} WHERE id = $1`, [teamId, ...values]);
  res.json({ message: 'Team updated' });
};

const softDeleteTeam = async (req, res) => {
  await pool.query('UPDATE teams SET deleted_at = NOW() WHERE id = $1', [req.params.id]);
  res.json({ message: 'Team soft-deleted' });
};

const getTeamsByFederation = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM teams WHERE federation_id = $1 AND deleted_at IS NULL',
    [req.params.id]
  );
  res.json(result.rows);
};

const getTeamsByCreator = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM teams WHERE created_by = $1 AND deleted_at IS NULL',
    [req.params.userId]
  );
  res.json(result.rows);
};

// === Players & Invites ===

const getTeamPlayers = async (req, res) => {
  const result = await pool.query(
    'SELECT u.first_name, u.last_name, u.email, p.position FROM player_profiles p JOIN users u ON u.id = p.user_id WHERE p.team_id = $1',
    [req.params.id]
  );
  res.json(result.rows);
};

const joinTeamByInviteCode = async (req, res) => {
  const { invite_code, user_id } = req.body;

  const invite = await pool.query(
    'SELECT * FROM team_invites WHERE invite_code = $1 AND status = $2',
    [invite_code, 'pending']
  );

  if (invite.rows.length === 0) {
    return res.status(404).json({ error: 'Invalid or expired invite code' });
  }

  await pool.query('UPDATE player_profiles SET team_id = $1 WHERE user_id = $2', [
    invite.rows[0].team_id,
    user_id,
  ]);

  await pool.query('UPDATE team_invites SET status = $1 WHERE id = $2', ['accepted', invite.rows[0].id]);

  res.json({ message: 'Joined team successfully' });
};

const removePlayerFromTeam = async (req, res) => {
  const { user_id } = req.body;
  await pool.query(
    'UPDATE player_profiles SET team_id = NULL WHERE user_id = $1 AND team_id = $2',
    [user_id, req.params.id]
  );
  res.json({ message: 'Player removed from team' });
};

// === Stats, Invites, Announcements ===

const getTeamInvites = async (req, res) => {
  const result = await pool.query(
    `SELECT i.*, u.first_name, u.last_name
     FROM team_invites i
     JOIN users u ON u.id = i.user_id
     WHERE i.team_id = $1 AND i.status = 'pending'`,
    [req.params.id]
  );
  res.json(result.rows);
};

const getTeamStats = async (req, res) => {
  const result = await pool.query(
    `SELECT COUNT(*) as total_matches,
            SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
            SUM(points_scored) as total_points
     FROM team_stats
     WHERE team_id = $1`,
    [req.params.id]
  );
  res.json(result.rows[0]);
};

const createTeamAnnouncement = async (req, res) => {
  const { title, body, created_by } = req.body;
  await pool.query(
    'INSERT INTO announcements (team_id, title, body, created_by) VALUES ($1, $2, $3, $4)',
    [req.params.id, title, body, created_by]
  );
  res.status(201).json({ message: 'Announcement created' });
};

const getTeamAnnouncements = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM announcements WHERE team_id = $1 ORDER BY created_at DESC',
    [req.params.id]
  );
  res.json(result.rows);
};

// === Optional Utility ===

const searchTeams = async (req, res) => {
  const { q } = req.query;
  const result = await pool.query(
    'SELECT * FROM teams WHERE name ILIKE $1 AND deleted_at IS NULL',
    [`%${q}%`]
  );
  res.json(result.rows);
};



const uploadTeamMedia = async (req, res) => {
  const { media_url, type } = req.body;
  await pool.query(
    'INSERT INTO team_media (team_id, media_url, type) VALUES ($1, $2, $3)',
    [req.params.id, media_url, type]
  );
  res.status(201).json({ message: 'Media uploaded' });
};


// --- 1. Team Roster  ---
const TeamRoster = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name, u.last_name, u.email, p.position
    FROM player_profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.team_id = $1
  `, [req.params.id]);

  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('team_roster.csv');
  res.send(csv);
};

// --- 2. Team Schedule  ---
const TeamSchedule = async (req, res) => {
  const result = await pool.query(`
    SELECT m.match_date, 
           CASE WHEN m.home_team_id = $1 THEN away.name ELSE home.name END AS opponent,
           m.location,
           m.result
    FROM tournament_matches m
    LEFT JOIN teams home ON home.id = m.home_team_id
    LEFT JOIN teams away ON away.id = m.away_team_id
    WHERE m.home_team_id = $1 OR m.away_team_id = $1
    ORDER BY m.match_date
  `, [req.params.id]);

  const csv = new Parser({ fields: ['match_date', 'opponent', 'location', 'result'] }).parse(result.rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('team_schedule.csv');
  res.send(csv);
};

// --- 3. Team Announcements  ---
const TeamAnnouncements = async (req, res) => {
  const result = await pool.query(`
    SELECT title, body, created_by, created_at
    FROM announcements
    WHERE team_id = $1
    ORDER BY created_at DESC
  `, [req.params.id]);

  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('team_announcements.csv');
  res.send(csv);
};

// --- 4. Player Performance  ---
const PlayerPerformance = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name || ' ' || u.last_name AS player_name,
           ps.matches_played,
           ps.goals,
           ps.assists,
           ps.yellow_cards,
           ps.red_cards
    FROM player_stats ps
    JOIN users u ON u.id = ps.user_id
    WHERE ps.team_id = $1
  `, [req.params.id]);

  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('player_performance.csv');
  res.send(csv);
};

// --- 5. Attendance  ---
const TeamAttendance = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name || ' ' || u.last_name AS player,
           a.attendance_date,
           a.status
    FROM attendance a
    JOIN users u ON u.id = a.user_id
    WHERE a.team_id = $1
    ORDER BY u.last_name, a.attendance_date
  `, [req.params.id]);

  const rows = result.rows;

  // Pivot attendance data
  const grouped = {};
  const dateSet = new Set();

  rows.forEach(({ player, attendance_date, status }) => {
    dateSet.add(attendance_date);
    if (!grouped[player]) grouped[player] = {};
    grouped[player][attendance_date] = status;
  });

  const sortedDates = [...dateSet].sort();
  const csvData = Object.entries(grouped).map(([player, attendanceByDate]) => {
    const row = { player };
    sortedDates.forEach((date) => {
      row[date] = attendanceByDate[date] || '—';
    });
    return row;
  });

  const csv = new Parser({ fields: ['player', ...sortedDates] }).parse(csvData);
  res.header('Content-Type', 'text/csv');
  res.attachment('attendance.csv');
  res.send(csv);
};

// --- 6. Team Stats Summary  ---
const TeamStats = async (req, res) => {
  const result = await pool.query(`
    SELECT COUNT(*) AS total_matches,
           SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) AS wins,
           SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) AS losses,
           SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) AS draws,
           SUM(points_scored) AS goals_scored
    FROM team_stats
    WHERE team_id = $1
  `, [req.params.id]);

  const csv = new Parser().parse([result.rows[0]]);
  res.header('Content-Type', 'text/csv');
  res.attachment('team_stats.csv');
  res.send(csv);
};

const assignTeamRole = async (req, res) => {
  const { userId, role } = req.body;
  try {
    await pool.query(`
      INSERT INTO team_roles (team_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (team_id, user_id) DO UPDATE SET role = $3
    `, [req.params.id, userId, role]);

    res.json({ message: 'Role assigned' });
  } catch (err) {
    console.error('assignTeamRole error:', err);
    res.status(500).json({ error: 'Internal error' });
  }
};

const getTeamRoles = async (req, res) => {
  const result = await pool.query(`
    SELECT user_id, role FROM team_roles WHERE team_id = $1
  `, [req.params.id]);
  res.json(result.rows);
};


const updateTeamTags = async (req, res) => {
  const { tags } = req.body; // Expects array
  try {
    await pool.query(`UPDATE teams SET tags = $1 WHERE id = $2`, [tags, req.params.id]);
    res.json({ message: 'Tags updated' });
  } catch (err) {
    console.error('updateTeamTags error:', err);
    res.status(500).json({ error: 'Failed to update tags' });
  }
};

const getTeamFacilities = async (req, res) => {
  const result = await pool.query(`SELECT * FROM team_facilities WHERE team_id = $1`, [req.params.id]);
  res.json(result.rows);
};

const createTeamFacility = async (req, res) => {
  const { name, address } = req.body;
  await pool.query(`
    INSERT INTO team_facilities (team_id, name, address)
    VALUES ($1, $2, $3)
  `, [req.params.id, name, address]);
  res.status(201).json({ message: 'Facility added' });
};

const getTeamDocuments = async (req, res) => {
  const result = await pool.query(`SELECT * FROM team_documents WHERE team_id = $1`, [req.params.id]);
  res.json(result.rows);
};

const uploadTeamDocument = async (req, res) => {
  const { title, url, uploaded_by } = req.body;
  await pool.query(`
    INSERT INTO team_documents (team_id, title, url, uploaded_by)
    VALUES ($1, $2, $3, $4)
  `, [req.params.id, title, url, uploaded_by]);
  res.status(201).json({ message: 'Document uploaded' });
};

const deleteTeamDocument = async (req, res) => {
  await pool.query(`DELETE FROM team_documents WHERE id = $1`, [req.params.docId]);
  res.json({ message: 'Document deleted' });
};


const getTeamNotes = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM team_notes WHERE team_id = $1 ORDER BY created_at DESC
  `, [req.params.id]);
  res.json(result.rows);
};

const addTeamNote = async (req, res) => {
  const { note, created_by, player_id } = req.body;
  await pool.query(`
    INSERT INTO team_notes (team_id, player_id, note, created_by)
    VALUES ($1, $2, $3, $4)
  `, [req.params.id, player_id, note, created_by]);
  res.status(201).json({ message: 'Note added' });
};

const getTeamMessages = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM team_messages WHERE team_id = $1 ORDER BY created_at DESC
  `, [req.params.id]);
  res.json(result.rows);
};

const postTeamMessage = async (req, res) => {
  const { message, sender_id } = req.body;
  await pool.query(`
    INSERT INTO team_messages (team_id, message, sender_id)
    VALUES ($1, $2, $3)
  `, [req.params.id, message, sender_id]);
  res.status(201).json({ message: 'Message sent' });
};

const getAvailability = async (req, res) => {
  const result = await pool.query(`
    SELECT * FROM availability WHERE team_id = $1 ORDER BY date ASC
  `, [req.params.id]);
  res.json(result.rows);
};

const setAvailability = async (req, res) => {
  const { user_id, date, status } = req.body; // status: 'yes', 'no', 'maybe'
  await pool.query(`
    INSERT INTO availability (team_id, user_id, date, status)
    VALUES ($1, $2, $3, $4)
    ON CONFLICT (team_id, user_id, date) DO UPDATE SET status = $4
  `, [req.params.id, user_id, date, status]);
  res.status(201).json({ message: 'Availability set' });
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
};
