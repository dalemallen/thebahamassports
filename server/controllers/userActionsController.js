import pool from "../db/index.js";
import { v4 as uuidv4 } from "uuid";

// GET /api/users/:id/actions
const getUserActions = async (req, res) => {
	const { id } = req.params;
	const { status } = req.query; // optional

	let sql = `
		SELECT id, title, description, due_date, priority, status
		FROM user_actions
		WHERE user_id = $1
	`;
	const params = [id];

	if (status) {
		sql += ` AND status = $2`;
		params.push(status);
	}

	sql += ` ORDER BY priority DESC, due_date ASC NULLS LAST`;

	try {
		const { rows } = await pool.query(sql, params);
		res.json(rows);
	} catch (err) {
		console.error("Error fetching user actions:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// PATCH /api/users/:id/actions/:actionId
const updateUserActionStatus = async (req, res) => {
	const { id, actionId } = req.params;
	const { status } = req.body; // expected: 'completed' or 'dismissed'

	if (!["completed", "dismissed"].includes(status)) {
		return res.status(400).json({ error: "Invalid status" });
	}

	try {
		const { rowCount } = await pool.query(
			`UPDATE user_actions
       SET status = $1
       WHERE id = $2 AND user_id = $3`,
			[status, actionId, id]
		);

		if (rowCount === 0) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json({ message: "Action updated", status });
	} catch (err) {
		console.error("Error updating user action:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// GET /api/users/:id/actions
const getPendingActions = async (req, res) => {
	const { id } = req.params;

	try {
		const { rows } = await pool.query(
			`SELECT id, title, description, due_date, priority, status
       FROM user_actions
       WHERE user_id = $1 AND status = 'pending'
       ORDER BY priority DESC, due_date ASC NULLS LAST`,
			[id]
		);

		res.json(rows);
	} catch (err) {
		console.error("Error fetching user actions:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// POST /api/users/:id/actions
const createAction = async (req, res) => {
	const { id } = req.params;
	const { title, description, due_date, priority } = req.body;

	if (!title) {
		return res.status(400).json({ error: "Title is required" });
	}

	try {
		const newId = uuidv4();

		await pool.query(
			`INSERT INTO user_actions (id, user_id, title, description, due_date, priority, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')`,
			[newId, id, title, description, due_date, priority || 1]
		);

		res.status(201).json({ message: "Action created", id: newId });
	} catch (err) {
		console.error("Error creating action:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// PATCH /api/users/:id/actions/:actionId
const updateAction = async (req, res) => {
	const { id, actionId } = req.params;
	const { status } = req.body;

	if (!["completed", "dismissed"].includes(status)) {
		return res.status(400).json({ error: "Invalid status" });
	}

	try {
		const { rowCount } = await pool.query(
			`UPDATE user_actions
       SET status = $1
       WHERE id = $2 AND user_id = $3`,
			[status, actionId, id]
		);

		if (rowCount === 0) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json({ message: "Action updated", status });
	} catch (err) {
		console.error("Error updating user action:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

// DELETE /api/users/:id/actions/:actionId
const deleteAction = async (req, res) => {
	const { id, actionId } = req.params;

	try {
		const { rowCount } = await pool.query(
			`DELETE FROM user_actions WHERE id = $1 AND user_id = $2`,
			[actionId, id]
		);

		if (rowCount === 0) {
			return res.status(404).json({ error: "Action not found" });
		}

		res.json({ message: "Action deleted" });
	} catch (err) {
		console.error("Error deleting user action:", err);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default {
	getUserActions,
	updateUserActionStatus,
	getPendingActions,
	createAction,
	updateAction,
	deleteAction,
};
