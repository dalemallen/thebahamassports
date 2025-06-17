import express from 'express';
import playerController from '../controllers/playerController.js';
import { requireRole } from '../middleware/rbac.js';


const router = express.Router();

// Core
router.get('/', playerController.getAllPlayers);
router.get('/team/:teamId', playerController.getPlayersByTeam);
router.get('/federation/:federationId', playerController.getPlayersByFederation);
router.get('/leaderboard', playerController.getPlayerLeaderboard);
router.get('/search', playerController.searchPlayers);

// Stats & Profile
router.get('/:id/stats', playerController.getPlayerStats);
router.get('/:id/attendance', playerController.getPlayerAttendance);
router.get('/:id/trainings', playerController.getPlayerTrainingHistory);
router.get('/:id/calendar', playerController.getPlayerCalendarAvailability);
router.get('/:id/full-profile', playerController.getPlayerFullProfile);
router.get('/:id/team-history', playerController.getPlayerTeamHistory);
router.get('/:id/awards', playerController.getPlayerAwards);

// Roles & Evaluation

router.post('/evaluate', requireRole(['coach', 'federation']), playerController.evaluatePlayer);

router.post('/assign-role', playerController.assignPlayerRole);

// Availability
router.patch('/:id/availability', playerController.updatePlayerAvailability);

// Highlights & Notes
router.post('/:id/highlights', playerController.addPlayerHighlight);
router.get('/:id/highlights', playerController.getPlayerMediaGallery);
router.get('/:id/notes', playerController.getPlayerNotes);

// Player Actions
router.post('/:id/flag', playerController.flagPlayerForReview);
router.post('/:id/misconduct', playerController.reportPlayerMisconduct);
router.delete('/:id', playerController.deactivatePlayer);

// Comparison & Ranking
router.get('/compare', playerController.comparePlayers);
router.get('/top-by-stat', playerController.getTopPlayersByStat);

// Follow System
router.post('/:id/follow', playerController.followPlayer);
router.post('/:id/unfollow', playerController.unfollowPlayer);
router.get('/:id/followers', playerController.getFollowers);



export default router;
