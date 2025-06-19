import express from 'express';
import eventsController from '../controllers/eventsController.js';

const router = express.Router();

// 🗓️ General Event Queries
router.get('/', eventsController.getUpcomingEvents); // This month → future
router.get('/all', eventsController.getAllEvents); // All events
router.get('/range', eventsController.getEventsByDateRange); // Custom range
router.get('/past', eventsController.getPastEvents); // Past only
router.get('/recurring', eventsController.getRecurringEvents); // Recurring events (optional)
router.get('/filters/types', eventsController.getEventTypes); // Event type filters
router.get('/filters/status', eventsController.getEventStatuses); // Event status filters

// 🧑‍🤝‍🧑 Contextual Schedules
router.get('/user/:userId/schedule', eventsController.getUserSchedule); // Events for a user
router.get('/team/:teamId/schedule', eventsController.getTeamSchedule); // Events for a team
router.get('/federation/:federationId/schedule', eventsController.getFederationSchedule); // Events for a federation
router.get('/venue/:venueId/schedule', eventsController.getVenueSchedule); // Events for a venue (optional)

// 📊 Results & Exports
router.get('/:eventId/results', eventsController.getEventResults); // Results of an event
router.get('/export/csv', eventsController.exportEventsToCSV); // Download all events as CSV

// ➕ Admin Routes (Optional: secured)
router.post('/', eventsController.createEvent);
router.patch('/:id', eventsController.updateEvent);
router.delete('/:id', eventsController.deleteEvent);

// 🔍 Single Event Details (placed after dynamic routes)
router.get('/:id', eventsController.getEventById);

export default router;
