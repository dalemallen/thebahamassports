// routes/users.js
import express from 'express';
import {
  registerUser,
  getUserById,
  completeOnboarding
} from '../controllers/usersController.js';

const router = express.Router();

router.post('/register-user', registerUser);
router.get('/:id', getUserById);
router.patch('/:id/complete-onboarding', completeOnboarding);

export default router;
