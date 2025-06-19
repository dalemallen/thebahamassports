// routes/tournaments.js
import express from 'express';
import {
  getAllTournaments,
  getTournamentById,
  registerForTournament
} from '../controllers/tournamentsController.js';

const router = express.Router();

router.get('/', getAllTournaments);
router.get('/:id', getTournamentById);
router.post('/register', registerForTournament);

export default router;