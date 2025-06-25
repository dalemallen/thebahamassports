// utils/memberControllerFactory.js
import pool from '../db/index.js';

export const createMemberController = ({ tableName, entityKey }) => ({
  requestJoin: async (req, res) => {
    const { entityId, role } = req.body;
    const userId = req.user.id;

    try {
      const result = await pool.query(
        `INSERT INTO ${tableName} (user_id, ${entityKey}, role, status)
         VALUES ($1, $2, $3, 'pending')
         ON CONFLICT DO NOTHING`,
        [userId, entityId, role]
      );
      res.json({ message: "Join request submitted" });
    } catch (err) {
      console.error("requestJoin error", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  respondToRequest: async (req, res) => {
    const { memberId } = req.params;
    const { response } = req.body;

    if (!['accepted', 'rejected'].includes(response)) {
      return res.status(400).json({ error: 'Invalid response' });
    }

    try {
      const update = await pool.query(
        `UPDATE ${tableName}
         SET status = $1
         WHERE id = $2`,
        [response, memberId]
      );
      if (update.rowCount === 0) {
        return res.status(404).json({ error: "Member not found" });
      }

      res.json({ message: `Member ${response}` });
    } catch (err) {
      console.error("respondToRequest error", err);
      res.status(500).json({ error: "Internal server error" });
    }
  }
});