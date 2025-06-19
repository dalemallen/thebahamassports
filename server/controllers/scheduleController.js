import pool from '../db/index.js';

export const getAllScheduleEvents = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM schedule ORDER BY start_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching schedule events:', err);
    res.status(500).json({ error: 'Failed to fetch schedule events' });
  }
};

export const getScheduleEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM schedule WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching schedule event:', err);
    res.status(500).json({ error: 'Failed to fetch schedule event' });
  }
};

export const createScheduleEvent = async (req, res) => {
  try {
    const { title, description, start_date, end_date, federation_id } = req.body;
    const result = await pool.query(
      'INSERT INTO schedule (title, description, start_date, end_date, federation_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, start_date, end_date, federation_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating schedule event:', err);
    res.status(500).json({ error: 'Failed to create schedule event' });
  }
};
