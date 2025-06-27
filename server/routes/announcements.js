// server/routes/announcementsRoutes.js
import express from "express";
import announcementsController from "../controllers/announcementsController.js";

const router = express.Router();

router.get("/team/:teamId", announcementsController.getAnnouncementsByTeam);

export default router;
