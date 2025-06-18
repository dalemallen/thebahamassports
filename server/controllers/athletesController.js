import pool from '../db/index.js';

// POST /api/athletes
exports.createAthleteProfile = async (req, res) => {
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

// GET /api/athletes/:id
exports.getAthleteProfile = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(`
      SELECT * FROM athlete_profiles
      WHERE user_id = $1
    `, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Athlete profile not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('getAthleteProfile error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// PUT /api/athletes/:id
exports.updateAthleteProfile = async (req, res) => {
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

export const getTopAthletes = async (req, res) => {
  const { sportId, federationId } = req.query;

  try {
    const result = await pool.query(
      `SELECT a.id, u.first_name || ' ' || u.last_name as name, a.position, a.points
       FROM athlete_profiles a
       JOIN users u ON a.user_id = u.id
       WHERE a.deleted_at IS NULL
         AND u.id IN (
           SELECT user_id FROM user_roles WHERE role_id = (
             SELECT id FROM roles WHERE name = 'athlete'
           )
         )
         AND a.club_team IN (
           SELECT name FROM teams WHERE federation_id = $1
         )
       ORDER BY a.points DESC NULLS LAST
       LIMIT 6`,
      [federationId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching top athletes:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

