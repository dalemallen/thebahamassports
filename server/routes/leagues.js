import express from 'express';
import leaguesController from '../controllers/leaguesController.js'; // Adjust the path if needed

const router = express.Router();

router.get('/', leaguesController.getAllLeagues);
router.get('/:id', leaguesController.getLeagueById);
router.post('/register', leaguesController.registerForLeague);

export default router;
