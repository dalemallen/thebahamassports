import pool from '../db/index.js';

// GET /api/invites/:userId
exports.getPendingInvites = async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(
      `SELECT i.*, t.name as team_name
       FROM team_invites i
       JOIN teams t ON i.team_id = t.id
       WHERE i.user_id = $1 AND i.status = 'pending'`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('getPendingInvites error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/invites/:inviteId
exports.respondToInvite = async (req, res) => {
  const inviteId = req.params.inviteId;
  const { response } = req.body; // 'accepted' or 'rejected'

  if (!['accepted', 'rejected'].includes(response)) {
    return res.status(400).json({ error: 'Invalid response' });
  }

  try {
    const inviteRes = await pool.query(
      `UPDATE team_invites
       SET status = $1
       WHERE id = $2
       RETURNING user_id, team_id`,
      [response, inviteId]
    );

    if (inviteRes.rowCount === 0) {
      return res.status(404).json({ error: 'Invite not found' });
    }

    const { user_id, team_id } = inviteRes.rows[0];

    if (response === 'accepted') {
      await pool.query(
        `UPDATE player_profiles
         SET team_id = $1
         WHERE user_id = $2`,
        [team_id, user_id]
      );
    }

    res.json({ message: `Invite ${response}` });
  } catch (err) {
    console.error('respondToInvite error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};