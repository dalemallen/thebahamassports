import express from 'express';
import {
  createSponsorProfile,
  getSponsorProfile,
  updateSponsorProfile
} from '../controllers/sponsorsController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', checkJwt, checkRole('sponsor'), createSponsorProfile);
router.get('/:id', checkJwt, checkRole('sponsor'), getSponsorProfile);
router.put('/:id', checkJwt, checkRole('sponsor'), updateSponsorProfile);

export default router;
