// ✅ athleteRoutes.js
import express from "express";
import athletesController from "../controllers/athletesController.js";

const router = express.Router();

router.post("/", athletesController.createOrUpdateAthleteProfile);
router.get("/:id", athletesController.getAthleteProfile);
router.get("/", athletesController.getAllAthletes);

router.get(
	"/federation/:federationId",
	athletesController.getAthletesByFederation
);

router.get("/team/:teamId", athletesController.getAthletesByTeam);
router.get("/top/:sportId/:federationId", athletesController.getTopAthletes);
router.get("/stats/:id", athletesController.getAthleteStats);
router.put("/deactivate/:id", athletesController.deactivateAthlete);
router.post("/highlight/:id", athletesController.addAthleteHighlight);
router.get("/highlight/:id", athletesController.getAthleteHighlights);
router.get("/attendance/:id", athletesController.getAthleteAttendance);
router.get("/team-history/:id", athletesController.getAthleteTeamHistory);
// router.get("/search", athletesController.searchAthletes);

router.get("/leaderboard", athletesController.getAthleteLeaderboard);
router.post("/assign-role", athletesController.assignAthleteRole);
router.get(
	"/:id/training-history",
	athletesController.getAthleteTrainingHistory
);
router.put("/:id/availability", athletesController.updateAthleteAvailability);
router.get("/:id/awards", athletesController.getAthleteAwards);
router.post("/:id/flag", athletesController.flagAthleteForReview);
router.get("/:id/notes", athletesController.getAthleteNotes);
router.get("/compare", athletesController.compareAthletes);
router.get("/:id/media-gallery", athletesController.getAthleteMediaGallery);
router.get("/:id/full-profile", athletesController.getAthleteFullProfile);
router.post(
	"/:id/report-misconduct",
	athletesController.reportAthleteMisconduct
);
router.post("/:id/follow", athletesController.followAthlete);
router.post("/:id/unfollow", athletesController.unfollowAthlete);
router.get("/:id/followers", athletesController.getFollowers);
router.get("/:id/calendar", athletesController.getAthleteCalendarAvailability);
router.get("/top-by-stat", athletesController.getTopAthletesByStat);

export default router;
