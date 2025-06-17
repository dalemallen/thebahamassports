import express from 'express';
import usersController from '../controllers/usersController.js';

const router = express.Router();

router.post('/register-user', usersController.registerUser);
router.get('/:id', usersController.getUserById);
router.patch('/:id/complete-onboarding', usersController.completeOnboarding);

export default router;
