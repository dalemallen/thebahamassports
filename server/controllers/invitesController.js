import pool from "../db/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const createInvite = async (req, res) => {
	const { email, role, team_id, federation_id } = req.body;
	const sender_id = req.user.id;

	try {
		const token = jwt.sign(
			{ email, role, team_id, federation_id },
			process.env.INVITE_SECRET,
			{ expiresIn: "7d" }
		);

		await pool.query(
			`INSERT INTO invites (email, role, team_id, federation_id, sender_id, token)
       VALUES ($1, $2, $3, $4, $5, $6)`,
			[email, role, team_id, federation_id, sender_id, token]
		);

		res.json({ inviteUrl: `${process.env.APP_URL}/onboard?token=${token}` });
	} catch (err) {
		console.error("createInvite error:", err);
		res.status(500).json({ error: "Failed to create invite" });
	}
};

const getPendingInvites = async (req, res) => {
	const userId = req.params.userId;

	try {
		const result = await pool.query(
			`SELECT i.*, t.name as team_name, f.name as federation_name
       FROM invites i
       LEFT JOIN teams t ON i.team_id = t.id
       LEFT JOIN federations f ON i.federation_id = f.id
       WHERE i.user_id = $1 AND i.status = 'pending'`,
			[userId]
		);

		res.json(result.rows);
	} catch (err) {
		console.error("getPendingInvites error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

const respondToInvite = async (req, res) => {
	const inviteId = req.params.inviteId;
	const { response } = req.body; // 'accepted' or 'rejected'

	if (!["accepted", "rejected"].includes(response)) {
		return res.status(400).json({ error: "Invalid response" });
	}

	try {
		const inviteRes = await pool.query(
			`UPDATE invites
       SET status = $1
       WHERE id = $2
       RETURNING user_id, team_id`,
			[response, inviteId]
		);

		if (inviteRes.rowCount === 0) {
			return res.status(404).json({ error: "Invite not found" });
		}

		const { user_id, team_id } = inviteRes.rows[0];

		if (response === "accepted" && team_id) {
			await pool.query(
				`UPDATE player_profiles
         SET team_id = $1
         WHERE user_id = $2`,
				[team_id, user_id]
			);
		}

		res.json({ message: `Invite ${response}` });
	} catch (err) {
		console.error("respondToInvite error:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default {
	createInvite,
	getPendingInvites,
	respondToInvite,
};
