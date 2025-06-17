import express from 'express';
const router = express.Router();

import teamsController from '../controllers/teamsController.js';

router.get('/', teamsController.getAllTeams);
router.get('/:id', teamsController.getTeamById);
router.get('/:id/players', teamsController.getTeamPlayers);
router.post('/', teamsController.createTeam);
router.post('/join', teamsController.joinTeamByInviteCode);

// New routes
router.patch('/:id', teamsController.updateTeam);
router.delete('/:id', teamsController.softDeleteTeam);
router.get('/federation/:id', teamsController.getTeamsByFederation);
router.get('/creator/:userId', teamsController.getTeamsByCreator);

router.get('/:id/invites', teamsController.getTeamInvites);
router.post('/:id/remove-player', teamsController.removePlayerFromTeam);
router.get('/:id/stats', teamsController.getTeamStats);
router.post('/:id/announcement', teamsController.createTeamAnnouncement);
router.get('/:id/announcements', teamsController.getTeamAnnouncements);

// CSV Exports
router.get('/:id/export', teamsController.TeamRoster);
router.get('/:id/schedule/export', teamsController.TeamSchedule);
router.get('/:id/announcements/export', teamsController.TeamAnnouncements);
router.get('/:id/performance/export', teamsController.PlayerPerformance);
router.get('/:id/attendance/export', teamsController.TeamAttendance);
router.get('/:id/stats/export', teamsController.TeamStats);

// Team roles
router.post('/:id/assign-role', teamsController.assignTeamRole);
router.get('/:id/roles', teamsController.getTeamRoles);

// Custom tags
router.patch('/:id/tags', teamsController.updateTeamTags);

// Facility management
router.get('/:id/facilities', teamsController.getTeamFacilities);
router.post('/:id/facilities', teamsController.createTeamFacility);

// Team documents
router.get('/:id/documents', teamsController.getTeamDocuments);
router.post('/:id/documents', teamsController.uploadTeamDocument);
router.delete('/:id/documents/:docId', teamsController.deleteTeamDocument);

// Coach notes
router.get('/:id/notes', teamsController.getTeamNotes);
router.post('/:id/notes', teamsController.addTeamNote);

// Messaging
router.get('/:id/messages', teamsController.getTeamMessages);
router.post('/:id/messages', teamsController.postTeamMessage);

// Availability
router.get('/:id/availability', teamsController.getAvailability);
router.post('/:id/availability', teamsController.setAvailability);

// Calendar view (matches, training, availability)
router.get('/:id/calendar', teamsController.getTeamCalendar);

// Training sessions
router.post('/:id/trainings', teamsController.scheduleTraining);
router.get('/:id/trainings', teamsController.getTrainings);

// Opponent history + preview
router.get('/:id/opponents', teamsController.getTeamOpponents);

// Activity log
router.get('/:id/activity-log', teamsController.getActivityLog);

// Media gallery
router.get('/:id/gallery', teamsController.getGallery);
router.post('/:id/gallery', teamsController.uploadToGallery);

// Verification request
router.post('/:id/request-verification', teamsController.requestTeamVerification);

// Issue reporting
router.post('/:id/report-issue', teamsController.reportTeamIssue);

// Recruitment status
router.get('/:id/recruitment-status', teamsController.getRecruitmentStatus);
router.patch('/:id/recruitment-status', teamsController.updateRecruitmentStatus);

// Player evaluations
router.post('/:id/evaluate-player', teamsController.evaluatePlayer);

// Public contact form
router.post('/:id/contact', teamsController.sendContactEmail);

// MVP Core
router.patch('/:id/deactivate', teamsController.deactivateTeam);
router.post('/:id/assign-captain', teamsController.assignCaptain);
router.post('/:id/remove-captain', teamsController.removeCaptain);
router.post('/:id/join-request', teamsController.requestJoinTeam);
router.get('/:id/public', teamsController.getTeamPublicProfile);

// Nice-to-Have
router.get('/:id/export-summary', teamsController.exportSeasonSummary);
router.post('/:id/assign-award', teamsController.assignAward);
router.get('/:id/analytics', teamsController.getTeamAnalytics);
router.patch('/:id/custom-fields', teamsController.updateTeamCustomFields);
router.get('/user/:userId', teamsController.getTeamsByUser);
router.post('/:id/merge', teamsController.mergeTeams);
router.patch('/:id/suspend', teamsController.suspendTeam);

// Bonus
router.get('/:id/permissions', teamsController.getTeamPermissions);
router.patch('/:id/archive', teamsController.archiveTeam);
router.patch('/:id/restore', teamsController.restoreTeam);
router.get('/:id/timeline', teamsController.getTeamTimeline);

// Dues & Revenue
router.get('/:id/dues', teamsController.getTeamDues);
router.post('/:id/dues', teamsController.addTeamDue);
router.get('/:id/payments', teamsController.getTeamPayments);
router.get('/:id/revenue', teamsController.getTeamRevenue);

// Player management
router.post('/:id/players', teamsController.addPlayerToTeam);
router.delete('/:id/players/:playerId', teamsController.removePlayerById);
router.patch('/:id/players/:playerId/inactive', teamsController.deactivatePlayer);
router.patch('/:id/players/:playerId/position', teamsController.setPlayerPosition);

// Join request
router.patch('/:id/requests/:requestId', teamsController.respondToJoinRequest);

// Bulletin Board
router.get('/:id/bulletin', teamsController.getTeamBulletin);
router.post('/:id/bulletin', teamsController.postTeamBulletin);

// QR Code
router.get('/:id/qrcode', teamsController.getTeamQRCode);

// Equipment
router.get('/:id/equipment', teamsController.getTeamEquipment);
router.post('/:id/equipment', teamsController.addTeamEquipment);

// Transportation
router.get('/:id/transport', teamsController.getTeamTransport);
router.post('/:id/transport', teamsController.addTeamTransport);

// Meals/Nutrition
router.get('/:id/meals', teamsController.getTeamMeals);
router.post('/:id/meals', teamsController.addTeamMeal);

// Media
router.get('/:id/media', teamsController.getTeamMedia);
router.post('/:id/media', teamsController.uploadTeamMedia);

// Sponsors
router.get('/:id/sponsors', teamsController.getTeamSponsors);
router.post('/:id/sponsors', teamsController.addTeamSponsor);


export default  router;