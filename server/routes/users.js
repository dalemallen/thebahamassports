import express from "express";
import usersController from "../controllers/usersController.js";
import userActionsController from "../controllers/userActionsController.js"; // import actions

const router = express.Router();

// 📄 Standard user routes
router.get("/:id", usersController.getUserById);
router.post("/register-user", usersController.registerUser);
router.patch("/:id/complete-onboarding", usersController.completeOnboarding);
router.get("/me/:auth0_id", usersController.getUserByAuth0Id);

// 🔗 Actions (previously userActionsRoutes.js)
router.get("/:id/actions", userActionsController.getPendingActions);
router.post("/:id/actions", userActionsController.createAction);
router.patch("/:id/actions/:actionId", userActionsController.updateAction);
router.delete("/:id/actions/:actionId", userActionsController.deleteAction);

export default router;
