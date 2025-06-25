// routes/federationMembers.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { createMemberController } from '../utils/memberControllerFactory.js';

const router = express.Router();
const federationMemberController = createMemberController({
  tableName: 'federation_members',
  entityKey: 'federation_id'
});

router.post('/request', requireAuth, federationMemberController.requestJoin);
router.patch('/:memberId/respond', requireAuth, federationMemberController.respondToRequest);

export default router;