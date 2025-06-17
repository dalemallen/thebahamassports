import express from 'express';
import federationsController from '../controllers/federationsController.js'; // adjust path if needed

const router = express.Router();

router.get('/', federationsController.getFederations);
router.get('/:id', federationsController.getFederationById);

export default router;
