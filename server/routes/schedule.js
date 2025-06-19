import express from 'express';
import { getAllScheduleEvents, getScheduleEventById, createScheduleEvent } from '../controllers/scheduleController.js';

const router = express.Router();

router.get('/', getAllScheduleEvents);
router.get('/:id', getScheduleEventById);
router.post('/', createScheduleEvent);

export default router;
