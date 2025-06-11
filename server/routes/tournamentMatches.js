
import express from 'express';
import { getTournamentMatches, createTournamentMatch } from '../controllers/tournamentMatchesController.js';
import { checkJwt } from '../middleware/checkJwt.js';  // Adjust path as needed

const router = express.Router();

router.get('/tournament-matches', checkJwt, getTournamentMatches);
router.post('/tournament-matches', checkJwt, createTournamentMatch);

export default router;
