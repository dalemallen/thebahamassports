import pool from '../db/index.js';

// === Federation CRUD ===
 const getAllFederations = async (req, res) => {
  const result = await pool.query('SELECT * FROM federations WHERE deleted_at IS NULL');
  res.json(result.rows);
};

 const getFederationById = async (req, res) => {
  const result = await pool.query('SELECT * FROM federations WHERE id = $1', [req.params.id]);
  res.json(result.rows[0]);
};

// server/controllers/federationController.js
export const getFederationBySport = async (req, res) => {
  const { sportId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM federations WHERE sport_id = $1 AND deleted_at IS NULL',
      [sportId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Federation not found for this sport.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching federation by sport:', err);
    res.status(500).json({ error: 'Failed to fetch federation' });
  }
};


 const createFederation = async (req, res) => {
  const { name, sport_id, president } = req.body;
  const result = await pool.query(
    'INSERT INTO federations (name, sport_id, president) VALUES ($1, $2, $3) RETURNING *',
    [name, sport_id, president]
  );
  res.status(201).json(result.rows[0]);
};

 const updateFederation = async (req, res) => {
  const updates = req.body;
  const fields = Object.keys(updates);
  const values = Object.values(updates);
  const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  await pool.query(`UPDATE federations SET ${setClause} WHERE id = $1`, [req.params.id, ...values]);
  res.json({ message: 'Federation updated' });
};

 const deleteFederation = async (req, res) => {
  await pool.query('UPDATE federations SET deleted_at = NOW() WHERE id = $1', [req.params.id]);
  res.json({ message: 'Federation soft-deleted' });
};

// === Federation Roles ===
 const getFederationRoles = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_roles WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const assignFederationRole = async (req, res) => {
  const { user_id, role_name } = req.body;
  await pool.query(
    'INSERT INTO federation_roles (federation_id, user_id, role_name) VALUES ($1, $2, $3)',
    [req.params.id, user_id, role_name]
  );
  res.status(201).json({ message: 'Role assigned' });
};

// === Federation Events & News ===
 const getFederationEvents = async (req, res) => {
  const result = await pool.query('SELECT * FROM events WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const createFederationEvent = async (req, res) => {
  const { title, description, location, start_date, end_date } = req.body;
  await pool.query(
    'INSERT INTO events (federation_id, title, description, location, start_date, end_date) VALUES ($1, $2, $3, $4, $5, $6)',
    [req.params.id, title, description, location, start_date, end_date]
  );
  res.status(201).json({ message: 'Event created' });
};

 const getFederationNews = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_news WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const postFederationNews = async (req, res) => {
  const { title, content, author, image_url } = req.body;
  await pool.query(
    'INSERT INTO federation_news (federation_id, title, content, author, image_url, published_at) VALUES ($1, $2, $3, $4, $5, NOW())',
    [req.params.id, title, content, author, image_url]
  );
  res.status(201).json({ message: 'News posted' });
};

// === Federation Documents ===
 const getFederationDocuments = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_documents WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const uploadFederationDocument = async (req, res) => {
  const { title, url, uploaded_by } = req.body;
  await pool.query(
    'INSERT INTO federation_documents (federation_id, title, url, uploaded_by) VALUES ($1, $2, $3, $4)',
    [req.params.id, title, url, uploaded_by]
  );
  res.status(201).json({ message: 'Document uploaded' });
};

 const deleteFederationDocument = async (req, res) => {
  await pool.query('DELETE FROM federation_documents WHERE id = $1 AND federation_id = $2', [req.params.docId, req.params.id]);
  res.json({ message: 'Document deleted' });
};

// === Notes ===
 const getFederationNotes = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_notes WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const addFederationNote = async (req, res) => {
  const { note, created_by } = req.body;
  await pool.query(
    'INSERT INTO federation_notes (federation_id, note, created_by) VALUES ($1, $2, $3)',
    [req.params.id, note, created_by]
  );
  res.status(201).json({ message: 'Note added' });
};

// === Messages ===
 const getFederationMessages = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_messages WHERE federation_id = $1 ORDER BY created_at DESC', [req.params.id]);
  res.json(result.rows);
};

 const postFederationMessage = async (req, res) => {
  const { message, sender_id } = req.body;
  await pool.query(
    'INSERT INTO federation_messages (federation_id, message, sender_id) VALUES ($1, $2, $3)',
    [req.params.id, message, sender_id]
  );
  res.status(201).json({ message: 'Message posted' });
};

// === Verification & Reporting ===
 const requestFederationVerification = async (req, res) => {
  const { user_id, notes } = req.body;
  await pool.query(
    'INSERT INTO verifications (user_id, role, status, notes) VALUES ($1, $2, $3, $4)',
    [user_id, 'federation', 'pending', notes]
  );
  res.status(201).json({ message: 'Verification requested' });
};

 const reportFederationIssue = async (req, res) => {
  const { user_id, issue } = req.body;
  await pool.query(
    'INSERT INTO federation_issues (federation_id, user_id, issue, reported_at) VALUES ($1, $2, $3, NOW())',
    [req.params.id, user_id, issue]
  );
  res.status(201).json({ message: 'Issue reported' });
};

// === Calendar ===
 const getFederationCalendar = async (req, res) => {
  const result = await pool.query('SELECT * FROM calendar_events WHERE federation_id = $1 ORDER BY event_date ASC', [req.params.id]);
  res.json(result.rows);
};

 const addCalendarEvent = async (req, res) => {
  const { title, description, event_date } = req.body;
  await pool.query(
    'INSERT INTO calendar_events (federation_id, title, description, event_date) VALUES ($1, $2, $3, $4)',
    [req.params.id, title, description, event_date]
  );
  res.status(201).json({ message: 'Calendar event added' });
};

// === Equipment ===
 const getFederationEquipment = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_equipment WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const addFederationEquipment = async (req, res) => {
  const { name, quantity, notes } = req.body;
  await pool.query(
    'INSERT INTO federation_equipment (federation_id, name, quantity, notes) VALUES ($1, $2, $3, $4)',
    [req.params.id, name, quantity, notes]
  );
  res.status(201).json({ message: 'Equipment added' });
};

// === Stats ===
 const getFederationStats = async (req, res) => {
  const result = await pool.query(`
    SELECT COUNT(*) as total_teams,
           (SELECT COUNT(*) FROM events WHERE federation_id = $1) as total_events
    FROM teams WHERE federation_id = $1
  `, [req.params.id]);
  res.json(result.rows[0]);
};

// === Dues & Payments ===
 const getFederationDues = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_dues WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

 const addFederationDue = async (req, res) => {
  const { name, amount, due_date } = req.body;
  await pool.query(
    'INSERT INTO federation_dues (federation_id, name, amount, due_date) VALUES ($1, $2, $3, $4)',
    [req.params.id, name, amount, due_date]
  );
  res.status(201).json({ message: 'Due added' });
};

 const getFederationPayments = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_payments WHERE federation_id = $1', [req.params.id]);
  res.json(result.rows);
};

// === Timeline ===
 const getFederationTimeline = async (req, res) => {
  const result = await pool.query('SELECT * FROM federation_timeline WHERE federation_id = $1 ORDER BY event_time DESC', [req.params.id]);
  res.json(result.rows);
};

// Get all teams under a federation
const getFederationTeams = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM teams WHERE federation_id = $1 AND deleted_at IS NULL', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('getFederationTeams error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

 const getAthletesByFederation = async (req, res) => {
  const { id: federationId } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT u.id, u.first_name, u.last_name, ap.position, ap.club_team
      FROM users u
      JOIN athlete_profiles ap ON u.id = ap.user_id
      WHERE ap.federation_id = $1
      ORDER BY u.last_name ASC
      `,
      [federationId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching federation athletes:', err);
    res.status(500).json({ error: 'Failed to fetch federation athletes' });
  }
};

// Approve team join request to a federation
const approveTeamJoinRequest = async (req, res) => {
  const { request_id } = req.body;
  try {
    await pool.query('UPDATE team_invites SET status = $1 WHERE id = $2', ['approved', request_id]);
    res.json({ message: 'Team join request approved' });
  } catch (err) {
    console.error('approveTeamJoinRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get total revenue from dues/payments under this federation
const getFederationRevenue = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT SUM(amount) as total_revenue
      FROM federation_dues
      WHERE federation_id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getFederationRevenue error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get awards issued by a federation
const getFederationAwards = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM federation_awards WHERE federation_id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('getFederationAwards error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Assign award to a player or team
const assignFederationAward = async (req, res) => {
  const { federation_id, recipient_type, recipient_id, award_title, description } = req.body;
  try {
    await pool.query(`
      INSERT INTO federation_awards (federation_id, recipient_type, recipient_id, award_title, description)
      VALUES ($1, $2, $3, $4, $5)
    `, [federation_id, recipient_type, recipient_id, award_title, description]);
    res.status(201).json({ message: 'Award assigned' });
  } catch (err) {
    console.error('assignFederationAward error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Generate leaderboard from team stats
const getFederationLeaderboard = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT t.id, t.name, SUM(s.points_scored) as points
      FROM teams t
      LEFT JOIN team_stats s ON t.id = s.team_id
      WHERE t.federation_id = $1
      GROUP BY t.id
      ORDER BY points DESC
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('getFederationLeaderboard error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Manage federation-level staff roles
const manageFederationStaff = async (req, res) => {
  const { federation_id, user_id, role } = req.body;
  try {
    await pool.query(`
      INSERT INTO federation_roles (federation_id, user_id, role)
      VALUES ($1, $2, $3)
      ON CONFLICT (federation_id, user_id)
      DO UPDATE SET role = EXCLUDED.role
    `, [federation_id, user_id, role]);
    res.status(200).json({ message: 'Staff role assigned/updated' });
  } catch (err) {
    console.error('manageFederationStaff error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get federation contact info
const getFederationContacts = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT name, president, logo_url
      FROM federations
      WHERE id = $1
    `, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('getFederationContacts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Federation-level settings
const getFederationSettings = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM federation_settings WHERE federation_id = $1', [id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    console.error('getFederationSettings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Integration stub for syncing data
const syncWithNationalRegistry = async (req, res) => {
  try {
    // Placeholder for syncing logic with MOYSC or other systems
    res.status(200).json({ message: 'Sync completed (stub)' });
  } catch (err) {
    console.error('syncWithNationalRegistry error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const exportFederationSummary = async (req, res) => {
  try {
    const federationId = req.params.id;

    const [teamsRes, athletesRes] = await Promise.all([
      pool.query('SELECT id, name FROM teams WHERE federation_id = $1', [federationId]),
      pool.query(`
        SELECT u.first_name, u.last_name, a.position, a.club_team
        FROM athlete_profiles a
        JOIN users u ON u.id = a.user_id
        WHERE a.club_team IN (
          SELECT name FROM teams WHERE federation_id = $1
        )
      `, [federationId])
    ]);

    const csv = new Parser({ fields: ['first_name', 'last_name', 'position', 'club_team'] }).parse(athletesRes.rows);
    res.header('Content-Type', 'text/csv').attachment('federation_summary.csv').send(csv);
  } catch (err) {
    console.error('exportFederationSummary error:', err);
    res.status(500).json({ error: 'Failed to export summary' });
  }
};

// 2. Broadcast update across all teams in federation
const federationBroadcastUpdates = async (req, res) => {
  try {
    const { title, body, created_by } = req.body;
    const federationId = req.params.id;

    const teamRes = await pool.query('SELECT id FROM teams WHERE federation_id = $1', [federationId]);
    const teams = teamRes.rows;

    for (const team of teams) {
      await pool.query(
        'INSERT INTO announcements (team_id, title, body, created_by) VALUES ($1, $2, $3, $4)',
        [team.id, title, body, created_by]
      );
    }

    res.status(201).json({ message: 'Broadcast sent to all teams' });
  } catch (err) {
    console.error('federationBroadcastUpdates error:', err);
    res.status(500).json({ error: 'Broadcast failed' });
  }
};

// 3. Manage federation sponsors
const manageFederationSponsors = async (req, res) => {
  try {
    const federationId = req.params.id;
    const result = await pool.query(
      `SELECT sp.* FROM sponsor_profiles sp
       JOIN sponsor_team_support sts ON sp.id = sts.sponsor_id
       JOIN teams t ON t.id = sts.team_id
       WHERE t.federation_id = $1`,
      [federationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('manageFederationSponsors error:', err);
    res.status(500).json({ error: 'Failed to fetch sponsors' });
  }
};

// 4. Schedule federation-level meetings
const scheduleAnnualMeetings = async (req, res) => {
  try {
    const { title, start_time, end_time, location } = req.body;
    await pool.query(
      'INSERT INTO federation_calendar (federation_id, title, start_time, end_time, location) VALUES ($1, $2, $3, $4, $5)',
      [req.params.id, title, start_time, end_time, location]
    );
    res.status(201).json({ message: 'Meeting scheduled' });
  } catch (err) {
    console.error('scheduleAnnualMeetings error:', err);
    res.status(500).json({ error: 'Failed to schedule meeting' });
  }
};

// 5. Get all athletes under this federation
const getFederationAthletes = async (req, res) => {
  try {
    const federationId = req.params.id;
    const result = await pool.query(`
      SELECT DISTINCT u.id, u.first_name, u.last_name, a.position, a.club_team
      FROM athlete_profiles a
      JOIN users u ON u.id = a.user_id
      JOIN teams t ON a.club_team = t.name
      WHERE t.federation_id = $1
    `, [federationId]);
    res.json(result.rows);
  } catch (err) {
    console.error('getFederationAthletes error:', err);
    res.status(500).json({ error: 'Failed to fetch athletes' });
  }
};

// WEEKLY SUMMARY
export const getWeeklySummary = async (req, res) => {
  const { federationId } = req.params;

  try {
    const result = await pool.query(
      `SELECT summary_text FROM weekly_summaries
       WHERE federation_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [federationId]
    );

    res.json(result.rows[0] || null);
  } catch (err) {
    console.error('Error fetching weekly summary:', err);
    res.status(500).json({ error: 'Failed to load summary' });
  }
};

// MEDIA HIGHLIGHTS
export const getMediaHighlights = async (req, res) => {
  const { federationId } = req.params;

  try {
    const result = await pool.query(
      `SELECT title, highlight_date, media_url
       FROM media_highlights
       WHERE federation_id = $1
       ORDER BY highlight_date DESC
       LIMIT 6`,
      [federationId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching media highlights:', err);
    res.status(500).json({ error: 'Failed to load highlights' });
  }
};





export default {
  getAllFederations,
  getFederationById,
  getFederationBySport,
  createFederation,
  updateFederation,
  deleteFederation,
  getFederationRoles,
  assignFederationRole,
  getFederationEvents,
  createFederationEvent,
  getFederationNews,
  postFederationNews,
  getFederationDocuments,
  uploadFederationDocument,
  deleteFederationDocument,
  getFederationNotes,
  addFederationNote,
  getFederationMessages,
  postFederationMessage,
  requestFederationVerification,
  reportFederationIssue,
  getFederationCalendar,
  addCalendarEvent,
  getFederationEquipment,
  addFederationEquipment,
  getFederationStats,
  getFederationDues,
  addFederationDue,
  getFederationPayments,
  getFederationTimeline,
    getFederationTeams,
  approveTeamJoinRequest,
  getFederationRevenue,
  getFederationAwards,
  assignFederationAward,
  getFederationLeaderboard,
  manageFederationStaff,
  getFederationContacts,
  getFederationSettings,
  syncWithNationalRegistry,
    exportFederationSummary,
  federationBroadcastUpdates,
  manageFederationSponsors,
  scheduleAnnualMeetings,
  getFederationAthletes,
  getWeeklySummary,
  getMediaHighlights,
  getAthletesByFederation,
};