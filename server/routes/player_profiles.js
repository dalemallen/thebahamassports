
import express from 'express';
import {
  getAllPlayerProfiles,
  getPlayerProfileById,
  createPlayerProfile,
  updatePlayerProfile,
  deletePlayerProfile
} from '../controllers/player_profiles.js';

const router = express.Router();

router.get('/', getAllPlayerProfiles);
router.get('/:id', getPlayerProfileById);
router.post('/', createPlayerProfile);
router.put('/:id', updatePlayerProfile);
router.delete('/:id', deletePlayerProfile);

export default router;
