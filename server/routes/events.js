import express from 'express';
import eventsController from '../controllers/eventsController.js'; // make sure path is correct

const router = express.Router();

router.get('/user/:userId', eventsController.getScheduleForUser);
router.get('/', eventsController.getAllEvents);
router.get('/:id/results', eventsController.getEventResults);

export default router;
