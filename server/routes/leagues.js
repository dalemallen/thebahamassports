// routes/leagues.js
import express from 'express';
import {
  getAllLeagues,
  getLeagueById,
  registerForLeague
} from '../controllers/leaguesController.js';

const router = express.Router();

router.get('/', getAllLeagues);
router.get('/:id', getLeagueById);
router.post('/register', registerForLeague);

export default router;
