import db from '../db/index.js';
import { parseISO, startOfMonth } from 'date-fns';

// 🗓️ General Event Queries
const getUpcomingEvents = async (req, res) => {
  try {
    const now = new Date();
    const result = await db.query(
      'SELECT * FROM events WHERE start_date >= $1 ORDER BY start_date ASC',
      [startOfMonth(now)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch upcoming events', error: err.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events ORDER BY start_date ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all events', error: err.message });
  }
};

const getEventsByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    if (!start || !end) return res.status(400).json({ message: 'Start and end dates required' });
    const result = await db.query(
      'SELECT * FROM events WHERE start_date >= $1 AND end_date <= $2 ORDER BY start_date ASC',
      [parseISO(start), parseISO(end)]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch events by range', error: err.message });
  }
};

const getPastEvents = async (req, res) => {
  try {
    const now = new Date();
    const result = await db.query('SELECT * FROM events WHERE end_date < $1 ORDER BY end_date DESC', [now]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch past events', error: err.message });
  }
};

const getRecurringEvents = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM events WHERE is_recurring = true');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch recurring events', error: err.message });
  }
};

const getEventTypes = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT event_type FROM events');
    res.json(result.rows.map(r => r.event_type));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event types', error: err.message });
  }
};

const getEventStatuses = async (req, res) => {
  try {
    const result = await db.query('SELECT DISTINCT status FROM events');
    res.json(result.rows.map(r => r.status));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event statuses', error: err.message });
  }
};

// 🧑‍🤝‍🧑 Contextual Schedules
const getUserSchedule = async (req, res) => {
  try {
    const { userId } = req.params;
    const result = await db.query('SELECT * FROM events WHERE $1 = ANY(participants)', [userId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user schedule', error: err.message });
  }
};

const getTeamSchedule = async (req, res) => {
  try {
    const { teamId } = req.params;
    const result = await db.query('SELECT * FROM events WHERE $1 = ANY(team_ids)', [teamId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch team schedule', error: err.message });
  }
};

const getFederationSchedule = async (req, res) => {
  try {
    const { federationId } = req.params;
    const result = await db.query('SELECT * FROM events WHERE federation_id = $1', [federationId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch federation schedule', error: err.message });
  }
};

const getVenueSchedule = async (req, res) => {
  try {
    const { venueId } = req.params;
    const result = await db.query('SELECT * FROM events WHERE venue_id = $1', [venueId]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch venue schedule', error: err.message });
  }
};

// 📊 Results & Exports
const getEventResults = async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await db.query('SELECT results FROM events WHERE id = $1', [eventId]);
    res.json(result.rows[0]?.results || []);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event results', error: err.message });
  }
};

const exportEventsToCSV = async (req, res) => {
  try {
    const result = await db.query('SELECT title, start_date, end_date, status FROM events');
    const rows = result.rows.map(evt => `${evt.title},${evt.start_date},${evt.end_date},${evt.status}`).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.send(`Title,Start,End,Status\n${rows}`);
  } catch (err) {
    res.status(500).json({ message: 'Failed to export CSV', error: err.message });
  }
};

// ➕ Admin CRUD
const createEvent = async (req, res) => {
  try {
    const { title, start_date, end_date, event_type, status, participants, team_ids, federation_id, venue_id, is_recurring, results } = req.body;
    const result = await db.query(
      'INSERT INTO events (title, start_date, end_date, event_type, status, participants, team_ids, federation_id, venue_id, is_recurring, results) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *',
      [title, start_date, end_date, event_type, status, participants, team_ids, federation_id, venue_id, is_recurring, results]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create event', error: err.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start_date, end_date, event_type, status, participants, team_ids, federation_id, venue_id, is_recurring, results } = req.body;
    const result = await db.query(
      'UPDATE events SET title=$1, start_date=$2, end_date=$3, event_type=$4, status=$5, participants=$6, team_ids=$7, federation_id=$8, venue_id=$9, is_recurring=$10, results=$11 WHERE id=$12 RETURNING *',
      [title, start_date, end_date, event_type, status, participants, team_ids, federation_id, venue_id, is_recurring, results, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update event', error: err.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM events WHERE id = $1', [id]);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete event', error: err.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM events WHERE id = $1', [id]);
    if (!result.rows.length) return res.status(404).json({ message: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch event', error: err.message });
  }
};

export default{
  getUpcomingEvents,
  getAllEvents,
  getEventsByDateRange,
  getPastEvents,
  getRecurringEvents,
  getEventTypes,
  getEventStatuses,
  getUserSchedule,
  getTeamSchedule,
  getFederationSchedule,
  getVenueSchedule,
  getEventResults,
  exportEventsToCSV,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById
};
