import express from "express";
import registrationController from "../controllers/registrationController.js";

const router = express.Router();

// 📋 User registration to events
router.post(
	"/user/:userId/event/:eventId",
	registrationController.registerUserForEvent
);
router.patch(
	"/user/:userId/event/:eventId",
	registrationController.updateUserRegistration
);
router.delete(
	"/user/:userId/event/:eventId",
	registrationController.softDeleteUserRegistration
);

// 📋 Team registration to events
router.post(
	"/team/:teamId/event/:eventId",
	registrationController.registerTeamForEvent
);
router.patch(
	"/team/:teamId/event/:eventId",
	registrationController.updateTeamRegistration
);
router.delete(
	"/team/:teamId/event/:eventId",
	registrationController.softDeleteTeamRegistration
);

// 📋 Federation registration to events
router.post(
	"/federation/:federationId/event/:eventId",
	registrationController.registerFederationForEvent
);
router.patch(
	"/federation/:federationId/event/:eventId",
	registrationController.updateFederationRegistration
);
router.delete(
	"/federation/:federationId/event/:eventId",
	registrationController.softDeleteFederationRegistration
);

// 📋 View all registrations for an event
router.get(
	"/event/:eventId/registrations",
	registrationController.getEventRegistrations
);

export default router;
