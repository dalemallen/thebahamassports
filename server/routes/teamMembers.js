// routes/teamMembers.js
import express from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { createMemberController } from '../utils/memberControllerFactory.js';

const router = express.Router();
const teamMemberController = createMemberController({
  tableName: 'team_members',
  entityKey: 'team_id'
});

router.post('/request', requireAuth, teamMemberController.requestJoin);
router.patch('/:memberId/respond', requireAuth, teamMemberController.respondToRequest);

export default router;