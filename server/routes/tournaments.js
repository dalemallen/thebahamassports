import express from 'express';
import tournamentsController from '../controllers/tournamentsController.js';

const router = express.Router();

router.get('/', tournamentsController.getAllTournaments);
router.get('/:id', tournamentsController.getTournamentById);

export default router;
