import express from 'express';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();
const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
    ssl: {
    rejectUnauthorized: false // ✅ required for Render and Heroku
  }
});

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
// router.get('/:id/export', teamsController.exportTeamRoster);
// router.get('/:id/schedule/export', teamsController.exportTeamSchedule);
// router.get('/:id/announcements/export', teamsController.exportTeamAnnouncements);
// router.get('/:id/performance/export', teamsController.exportPlayerPerformance);
// router.get('/:id/attendance/export', teamsController.exportTeamAttendance);
// router.get('/:id/stats/export', teamsController.exportTeamStats);

// // Team roles
// router.post('/:id/assign-role', teamsController.assignTeamRole);
// router.get('/:id/roles', teamsController.getTeamRoles);

// // Custom tags
// router.patch('/:id/tags', teamsController.updateTeamTags);

// // Facility management
// router.get('/:id/facilities', teamsController.getTeamFacilities);
// router.post('/:id/facilities', teamsController.createTeamFacility);

// // Team documents
// router.get('/:id/documents', teamsController.getTeamDocuments);
// router.post('/:id/documents', teamsController.uploadTeamDocument);
// router.delete('/:id/documents/:docId', teamsController.deleteTeamDocument);

// // Coach notes
// router.get('/:id/notes', teamsController.getTeamNotes);
// router.post('/:id/notes', teamsController.addTeamNote);

// // Messaging
// router.get('/:id/messages', teamsController.getTeamMessages);
// router.post('/:id/messages', teamsController.postTeamMessage);

// // Availability
// router.get('/:id/availability', teamsController.getAvailability);
// router.post('/:id/availability', teamsController.setAvailability);

export default  router;