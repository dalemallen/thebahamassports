import express from 'express';
import athletesController from '../controllers/athletesController.js'; // make sure the path and filename match
import { getTopAthletes } from '../controllers/athletesController.js';
const router = express.Router();

router.post('/', athletesController.createAthleteProfile);
// router.get('/:id', athletesController.getAthleteProfile);
router.put('/:id', athletesController.updateAthleteProfile);
router.get('/top', athletesController.getTopAthletes);
router.get('/top/:sportId/:federationId', getTopAthletes);


export default router;
