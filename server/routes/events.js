// routes/events.js
import express from 'express';
import { getAllEvents, getEventById } from '../controllers/eventsController.js';

const router = express.Router();

router.get('/events', getAllEvents);
router.get('/events/:id', getEventById);

export default router;
