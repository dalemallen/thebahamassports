import express from 'express';
import {
  createParentProfile,
  getParentProfile,
  updateParentProfile
} from '../controllers/parentsController.js';
import { checkJwt } from '../middleware/checkJwt.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.post('/', checkJwt, checkRole('parent'), createParentProfile);
router.get('/:id', checkJwt, checkRole('parent'), getParentProfile);
router.put('/:id', checkJwt, checkRole('parent'), updateParentProfile);

export default router;
