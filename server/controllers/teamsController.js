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
  const result = await pool.query(
    `SELECT COUNT(*) as total_matches,
            SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
            SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
            SUM(points_scored) as total_points
     FROM team_stats WHERE team_id = $1`,
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

// === CSV Exports ===

const TeamRoster = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name, u.last_name, u.email, p.position
    FROM player_profiles p
    JOIN users u ON u.id = p.user_id
    WHERE p.team_id = $1
  `, [req.params.id]);
  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv').attachment('team_roster.csv').send(csv);
};

const TeamSchedule = async (req, res) => {
  const result = await pool.query(`
    SELECT m.match_date,
           CASE WHEN m.home_team_id = $1 THEN away.name ELSE home.name END AS opponent,
           m.location, m.result
    FROM tournament_matches m
    LEFT JOIN teams home ON home.id = m.home_team_id
    LEFT JOIN teams away ON away.id = m.away_team_id
    WHERE m.home_team_id = $1 OR m.away_team_id = $1
    ORDER BY m.match_date
  `, [req.params.id]);
  const csv = new Parser({ fields: ['match_date', 'opponent', 'location', 'result'] }).parse(result.rows);
  res.header('Content-Type', 'text/csv').attachment('team_schedule.csv').send(csv);
};

const TeamAnnouncements = async (req, res) => {
  const result = await pool.query(`
    SELECT title, body, created_by, created_at
    FROM announcements
    WHERE team_id = $1
    ORDER BY created_at DESC
  `, [req.params.id]);
  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv').attachment('team_announcements.csv').send(csv);
};

const PlayerPerformance = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name || ' ' || u.last_name AS player_name,
           ps.matches_played, ps.goals, ps.assists, ps.yellow_cards, ps.red_cards
    FROM player_stats ps
    JOIN users u ON u.id = ps.user_id
    WHERE ps.team_id = $1
  `, [req.params.id]);
  const csv = new Parser().parse(result.rows);
  res.header('Content-Type', 'text/csv').attachment('player_performance.csv').send(csv);
};

const TeamAttendance = async (req, res) => {
  const result = await pool.query(`
    SELECT u.first_name || ' ' || u.last_name AS player,
           a.attendance_date, a.status
    FROM attendance a
    JOIN users u ON u.id = a.user_id
    WHERE a.team_id = $1
    ORDER BY u.last_name, a.attendance_date
  `, [req.params.id]);

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
    sortedDates.forEach(date => row[date] = dates[date] || '—');
    return row;
  });

  const csv = new Parser({ fields: ['player', ...sortedDates] }).parse(csvData);
  res.header('Content-Type', 'text/csv').attachment('attendance.csv').send(csv);
};

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
  res.header('Content-Type', 'text/csv').attachment('team_stats.csv').send(csv);
};

// === Export ===

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
  // searchTeams,
  // uploadTeamMedia,
  // TeamRoster,
  // TeamSchedule,
  // TeamAnnouncements,
  // PlayerPerformance,
  // TeamAttendance,
  // TeamStats,
};
