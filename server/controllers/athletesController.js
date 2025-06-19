import pool from '../db/index.js';

// POST /api/athletes
export const createAthleteProfile = async (req, res) => {
  const {
    user_id,
    birthdate,
    birthplace,
    height_cm,
    weight_kg,
    position,
    club_team,
    debut_year,
    caps,
    points,
    achievements,
    profile_photo_url
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    await pool.query(`
      INSERT INTO athlete_profiles (
        user_id, birthdate, birthplace, height_cm, weight_kg,
        position, club_team, debut_year, caps, points,
        achievements, profile_photo_url
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10,
        $11, $12
      )
      ON CONFLICT (user_id) DO UPDATE SET
        birthdate = EXCLUDED.birthdate,
        birthplace = EXCLUDED.birthplace,
        height_cm = EXCLUDED.height_cm,
        weight_kg = EXCLUDED.weight_kg,
        position = EXCLUDED.position,
        club_team = EXCLUDED.club_team,
        debut_year = EXCLUDED.debut_year,
        caps = EXCLUDED.caps,
        points = EXCLUDED.points,
        achievements = EXCLUDED.achievements,
        profile_photo_url = EXCLUDED.profile_photo_url;
    `, [
      user_id, birthdate, birthplace, height_cm, weight_kg,
      position, club_team, debut_year, caps, points,
      achievements, profile_photo_url
    ]);

    res.status(201).json({ message: 'Athlete profile created or updated' });
  } catch (err) {
    console.error('createAthleteProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/athletes/:id
export const updateAthleteProfile = async (req, res) => {
  const userId = req.params.id;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);
    const setClause = fields.map((field, idx) => `${field} = $${idx + 2}`).join(', ');

    await pool.query(`
      UPDATE athlete_profiles
      SET ${setClause}
      WHERE user_id = $1
    `, [userId, ...values]);

    res.json({ message: 'Athlete profile updated' });
  } catch (err) {
    console.error('updateAthleteProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/playerController.js
export const getTopAthletes = async (req, res) => {
  const { sportId, federationId } = req.params;
  console.log('Fetching top athletes for:', sportId, federationId);

  try {
    const result = await pool.query(
      `SELECT u.id, u.first_name, u.last_name, ap.stat_summary
       FROM users u
       JOIN athlete_profiles ap ON u.id = ap.user_id
       WHERE ap.sport_id = $1 AND ap.federation_id = $2
       ORDER BY ap.stat_summary DESC
       LIMIT 5`,
      [sportId, federationId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top athletes:', err);
    res.status(500).json({ error: 'Failed to fetch top athletes' });
  }
};


export default {
  createAthleteProfile,
  updateAthleteProfile,
  getTopAthletes,

};
