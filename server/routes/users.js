// routes/users.js
import express from 'express';
import {
  getUserByAuth0Id,
  registerUser,
  getUserById,
  completeOnboarding
} from '../controllers/usersController.js';

const router = express.Router();


// 🔍 Get user by Auth0 ID
router.get('/:auth0_id', getUserByAuth0Id);

// 🆕 Register user
router.post('/register-user', registerUser);
router.get('/:id', getUserById);
// ✅ Complete onboarding
router.patch('/:id/complete-onboarding', completeOnboarding);

export default router;
