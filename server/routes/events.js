import express from 'express';
import eventsController from '../controllers/eventsController.js'; // make sure path is correct

const router = express.Router();

router.get('/upcoming',eventsController.getUpcomingEvents);
// router.get('/user/:userId', getScheduleForUser);
// router.get('/', getAllEvents);
// router.get('/:id/results', getEventResults);

export default router;
