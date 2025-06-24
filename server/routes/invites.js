import express from "express";
import invitesController from "../controllers/invitesController.js";
import requireAuth from "../middleware/requireAuth.js"; // Adjust to your auth middleware
const router = express.Router();

// Protected routes
router.post("/", requireAuth, invitesController.createInvite);
router.get("/:userId", requireAuth, invitesController.getPendingInvites);
router.patch("/:inviteId", requireAuth, invitesController.respondToInvite);

export default router;
