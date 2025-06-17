import express from 'express';
import {
  createScoutProfile,
  getScoutProfile,
  updateScoutProfile
} from '../controllers/scoutsController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', checkJwt, checkRole('scout'), createScoutProfile);
router.get('/:id', checkJwt, checkRole('scout'), getScoutProfile);
router.put('/:id', checkJwt, checkRole('scout'), updateScoutProfile);

export default router;
