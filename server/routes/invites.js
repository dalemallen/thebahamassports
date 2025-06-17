import express from 'express';
import invitesController from '../controllers/invitesController.js';

const router = express.Router();

router.get('/:userId', invitesController.getPendingInvites);
router.patch('/:inviteId', invitesController.respondToInvite);

export default router;
