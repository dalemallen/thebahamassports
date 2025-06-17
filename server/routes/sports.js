// server/routes/sports.js
import express from 'express';
import { getAllSports } from '../controllers/sportsController.js';

const router = express.Router();
router.get('/', getAllSports);
export default router;
