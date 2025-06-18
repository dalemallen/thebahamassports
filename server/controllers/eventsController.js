// controllers/eventsController.js
import pool from '../db/index.js';


 const getAllEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
};

 const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
};

 const getUpcomingEvents = async (req, res) => {
  try {
    const { federationId } = req.query;

    const result = await pool.query(
      `SELECT * FROM events
       WHERE federation_id = $1 AND start_date >= CURRENT_DATE
       ORDER BY start_date ASC
       LIMIT 5`,
      [federationId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    res.status(500).json({ error: 'Failed to load upcoming events' });
  }
};


export default {
  getAllEvents,
  getEventById,
getUpcomingEvents
};