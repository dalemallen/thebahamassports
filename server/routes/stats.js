// server/routes/stats.js
import express from 'express';
import { getStatsBySport } from '../controllers/statsController.js';

const router = express.Router();

router.get('/by-sport/:sportId', getStatsBySport);

export default router;

