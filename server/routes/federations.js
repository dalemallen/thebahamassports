import express from "express";
import federationController from "../controllers/federationsController.js";
import requireAuth from "../middleware/requireAuth.js";

const router = express.Router();

router.get("/by-sport/:sportId", federationController.getFederationBySport);
router.get(
	"/:federationId/weekly-summary",
	federationController.getWeeklySummary
);
router.get(
	"/:federationId/media-highlights",
	federationController.getMediaHighlights
);
router.get(
	"/:federationId/athletes",
	federationController.getAthletesByFederation
);
router.get("/me", requireAuth, federationController.getFederationByUser);
router.patch(
	"/me",
	requireAuth,
	federationController.completeFederationOnboarding
);

router.get("/", federationController.getAllFederations);

router.get("/:id", requireAuth, async (req, res) => {
	const { id } = req.params;
	console.log("id: ", id);

	if (id === "me") {
		return federationController.getFederationByUser(req, res);
	}

	return federationController.getFederationById(req, res);
});

router.post("/", federationController.createFederation);
router.patch("/:id", federationController.updateFederation);
router.delete("/:id", federationController.deleteFederation);

router.get("/:id/roles", federationController.getFederationRoles);
router.post("/:id/assign-role", federationController.assignFederationRole);

router.get("/:id/events", federationController.getFederationEvents);
router.post("/:id/events", federationController.createFederationEvent);

router.get("/:id/news", federationController.getFederationNews);
router.post("/:id/news", federationController.postFederationNews);

router.get("/:id/documents", federationController.getFederationDocuments);
router.post("/:id/documents", federationController.uploadFederationDocument);
router.delete(
	"/:id/documents/:docId",
	federationController.deleteFederationDocument
);

router.get("/:id/notes", federationController.getFederationNotes);
router.post("/:id/notes", federationController.addFederationNote);

router.get("/:id/messages", federationController.getFederationMessages);
router.post("/:id/messages", federationController.postFederationMessage);

router.post("/:id/verify", federationController.requestFederationVerification);
router.post("/:id/report", federationController.reportFederationIssue);

router.get("/:id/calendar", federationController.getFederationCalendar);
router.post("/:id/calendar", federationController.addCalendarEvent);

router.get("/:id/equipment", federationController.getFederationEquipment);
router.post("/:id/equipment", federationController.addFederationEquipment);

router.get("/:id/stats", federationController.getFederationStats);

router.get("/:id/dues", federationController.getFederationDues);
router.post("/:id/dues", federationController.addFederationDue);
router.get("/:id/payments", federationController.getFederationPayments);

router.get("/:id/timeline", federationController.getFederationTimeline);

router.get("/:id/teams", federationController.getFederationTeams);
router.post("/:id/teams/approve", federationController.approveTeamJoinRequest);

router.get("/:id/revenue", federationController.getFederationRevenue);
router.get("/:id/awards", federationController.getFederationAwards);
router.post("/:id/awards", federationController.assignFederationAward);

router.get("/:id/leaderboard", federationController.getFederationLeaderboard);
router.post("/:id/staff", federationController.manageFederationStaff);

router.get("/:id/contacts", federationController.getFederationContacts);
router.get("/:id/settings", federationController.getFederationSettings);

router.post("/:id/sync", federationController.syncWithNationalRegistry);
router.get("/:id/export-summary", federationController.exportFederationSummary);
router.post("/:id/broadcast", federationController.federationBroadcastUpdates);
router.get("/:id/sponsors", federationController.manageFederationSponsors);
router.post("/:id/meetings", federationController.scheduleAnnualMeetings);
router.get("/:id/athletes", federationController.getFederationAthletes);

router.get("/:id/sponsors", federationController.getFederationSponsors);
router.get("/:id/rankings", federationController.getFederationRankings);
router.get("/:id/members", federationController.getFederationMembers);
router.get("/:id/spotlight", federationController.getFederationSpotlight);

export default router;
