import pool from '../db/index.js';

import getUserIdFromAuth0 from '../utils/getUserIdFromAuth0.js';

// POST /api/athletes
 const createAthleteProfile = async (req, res) => {
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
 const updateAthleteProfile = async (req, res) => {
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
 const getTopAthletes = async (req, res) => {
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



export const saveDraft = async (req, res) => {
  try {
    const {
      auth0_id,
      birthdate,
      birthplace,
      nationality,
      height_cm,
      weight_kg,
      position,
      preferred_side,
      club_team,
      debut_year,
      caps,
      points,
      achievements,
      social_links,
      profile_photo_url,
      show_public,
      sport_id,
      user_id: userIdFromBody,
    } = req.body;

        const user_id = userIdFromBody || await getUserIdFromAuth0(auth0_id);

    if (!user_id) {
      throw new Error('No valid user_id or auth0_id provided');
    }


    const existing = await pool.query(
      'SELECT * FROM athlete_profiles WHERE user_id = $1',
      [user_id]
    );

const normalizeInt = (value) => {
  const parsed = parseInt(value);
  return isNaN(parsed) ? null : parsed;
};

const payload = {
  user_id,
  birthdate,
  birthplace,
  nationality,
  height_cm: normalizeInt(height_cm),
  weight_kg: normalizeInt(weight_kg),
  position,
  preferred_side,
  club_team,
  debut_year: normalizeInt(debut_year),
  caps: normalizeInt(caps),
  points: normalizeInt(points),
  achievements: Array.isArray(achievements) ? achievements.filter(Boolean) : [],
  social_links: Array.isArray(social_links) ? social_links.filter(Boolean) : [],
  profile_photo_url,
  show_public,
  sport_id: normalizeInt(sport_id),
  updated_at: new Date()
};


    if (existing.rows.length > 0) {
      await pool.query(
        `UPDATE athlete_profiles SET 
          birthdate = $1, birthplace = $2, nationality = $3,
          height_cm = $4, weight_kg = $5, position = $6, preferred_side = $7, club_team = $8,
          debut_year = $9, caps = $10, points = $11, achievements = $12, social_links = $13,
          profile_photo_url = $14, show_public = $15, sport_id = $16, updated_at = $17
        WHERE user_id = $18`,
        [
          payload.birthdate, payload.birthplace, payload.nationality, payload.height_cm,
          payload.weight_kg, payload.position, payload.preferred_side, payload.club_team,
          payload.debut_year, payload.caps, payload.points, payload.achievements,
          payload.social_links, payload.profile_photo_url, payload.show_public,
          payload.sport_id, payload.updated_at, user_id
        ]
      );
      console.log('update');
    } else {
      await pool.query(
        `INSERT INTO athlete_profiles (
          user_id, birthdate, birthplace, nationality,
          height_cm, weight_kg, position, preferred_side,
          club_team, debut_year, caps, points, achievements,
          social_links, profile_photo_url, show_public, sport_id,
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15,
          $16, $17, NOW(), $18
        )`,
        [
          user_id, payload.birthdate, payload.birthplace, payload.nationality,
          payload.height_cm, payload.weight_kg, payload.position, payload.preferred_side,
          payload.club_team, payload.debut_year, payload.caps, payload.points,
          payload.achievements, payload.social_links, payload.profile_photo_url,
          payload.show_public, payload.sport_id, payload.updated_at
        ]
      );
        console.log('insert');
    }

    res.status(200).json({ message: 'Draft saved successfully' });
  } catch (err) {
    console.error('Error saving athlete draft:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




export default {
  createAthleteProfile,
  updateAthleteProfile,
  getTopAthletes,
  saveDraft,
};
