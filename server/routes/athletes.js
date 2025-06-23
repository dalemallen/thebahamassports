import express from 'express';
import athletesController from '../controllers/athletesController.js'; // make sure the path and filename match
const router = express.Router();

router.post('/', athletesController.createAthleteProfile);
// router.get('/:id', athletesController.getAthleteProfile);
router.put('/:id', athletesController.updateAthleteProfile);
router.get('/top', athletesController.getTopAthletes);
router.get('/top/:sportId/:federationId', athletesController.getTopAthletes);
router.post('/save-draft', athletesController.saveDraft);


export default router;
