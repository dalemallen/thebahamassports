import db from "../db/index.js";

const registerUserForEvent = async (req, res) => {
	const { userId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`INSERT INTO event_registrations (entity_id, entity_type, event_id, form_data) 
       VALUES ($1, 'user', $2, $3) RETURNING *`,
			[userId, eventId, form_data]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Failed to register user", error: err.message });
	}
};

const updateUserRegistration = async (req, res) => {
	const { userId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`UPDATE event_registrations 
       SET form_data=$1, updated_at=now() 
       WHERE entity_id=$2 AND entity_type='user' AND event_id=$3 
       RETURNING *`,
			[form_data, userId, eventId]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({
			message: "Failed to update user registration",
			error: err.message,
		});
	}
};

const softDeleteUserRegistration = async (req, res) => {
	const { userId, eventId } = req.params;

	try {
		await db.query(
			`UPDATE event_registrations 
       SET status='cancelled', updated_at=now() 
       WHERE entity_id=$1 AND entity_type='user' AND event_id=$2`,
			[userId, eventId]
		);
		res.json({ message: "User registration cancelled" });
	} catch (err) {
		res.status(500).json({
			message: "Failed to cancel user registration",
			error: err.message,
		});
	}
};

const registerTeamForEvent = async (req, res) => {
	const { teamId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`INSERT INTO event_registrations (entity_id, entity_type, event_id, form_data) 
       VALUES ($1, 'team', $2, $3) RETURNING *`,
			[teamId, eventId, form_data]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Failed to register team", error: err.message });
	}
};

const updateTeamRegistration = async (req, res) => {
	const { teamId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`UPDATE event_registrations 
       SET form_data=$1, updated_at=now() 
       WHERE entity_id=$2 AND entity_type='team' AND event_id=$3 
       RETURNING *`,
			[form_data, teamId, eventId]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({
			message: "Failed to update team registration",
			error: err.message,
		});
	}
};

const softDeleteTeamRegistration = async (req, res) => {
	const { teamId, eventId } = req.params;

	try {
		await db.query(
			`UPDATE event_registrations 
       SET status='cancelled', updated_at=now() 
       WHERE entity_id=$1 AND entity_type='team' AND event_id=$2`,
			[teamId, eventId]
		);
		res.json({ message: "Team registration cancelled" });
	} catch (err) {
		res.status(500).json({
			message: "Failed to cancel team registration",
			error: err.message,
		});
	}
};

const registerFederationForEvent = async (req, res) => {
	const { federationId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`INSERT INTO event_registrations (entity_id, entity_type, event_id, form_data) 
       VALUES ($1, 'federation', $2, $3) RETURNING *`,
			[federationId, eventId, form_data]
		);
		res.status(201).json(result.rows[0]);
	} catch (err) {
		res
			.status(500)
			.json({ message: "Failed to register federation", error: err.message });
	}
};

const updateFederationRegistration = async (req, res) => {
	const { federationId, eventId } = req.params;
	const { form_data } = req.body;

	try {
		const result = await db.query(
			`UPDATE event_registrations 
       SET form_data=$1, updated_at=now() 
       WHERE entity_id=$2 AND entity_type='federation' AND event_id=$3 
       RETURNING *`,
			[form_data, federationId, eventId]
		);
		res.json(result.rows[0]);
	} catch (err) {
		res.status(500).json({
			message: "Failed to update federation registration",
			error: err.message,
		});
	}
};

const softDeleteFederationRegistration = async (req, res) => {
	const { federationId, eventId } = req.params;

	try {
		await db.query(
			`UPDATE event_registrations 
       SET status='cancelled', updated_at=now() 
       WHERE entity_id=$1 AND entity_type='federation' AND event_id=$2`,
			[federationId, eventId]
		);
		res.json({ message: "Federation registration cancelled" });
	} catch (err) {
		res.status(500).json({
			message: "Failed to cancel federation registration",
			error: err.message,
		});
	}
};

const getEventRegistrations = async (req, res) => {
	const { eventId } = req.params;

	try {
		const result = await db.query(
			`SELECT * FROM event_registrations WHERE event_id=$1 ORDER BY registered_at ASC`,
			[eventId]
		);
		res.json(result.rows);
	} catch (err) {
		res.status(500).json({
			message: "Failed to fetch event registrations",
			error: err.message,
		});
	}
};

export default {
	registerUserForEvent,
	updateUserRegistration,
	softDeleteUserRegistration,
	registerTeamForEvent,
	updateTeamRegistration,
	softDeleteTeamRegistration,
	registerFederationForEvent,
	updateFederationRegistration,
	softDeleteFederationRegistration,
	getEventRegistrations,
};
