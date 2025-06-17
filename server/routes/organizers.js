import express from 'express';
import {
  createOrganizerProfile,
  getOrganizerProfile,
  updateOrganizerProfile
} from '../controllers/organizersController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', checkJwt, checkRole('organizer'), createOrganizerProfile);
router.get('/:id', checkJwt, checkRole('organizer'), getOrganizerProfile);
router.put('/:id', checkJwt, checkRole('organizer'), updateOrganizerProfile);

export default router;
