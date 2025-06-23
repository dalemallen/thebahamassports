import express from 'express';
import sportsController from '../controllers/sportsController.js';

const router = express.Router();

router.get('/', sportsController.getAllSports);
router.get('/with-federations', sportsController.getSportsWithFederations);

export default router;
