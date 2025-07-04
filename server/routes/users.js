// routes/users.js
import express from "express";
import usersController from "../controllers/usersController.js";

const router = express.Router();

// 🔍 Get user by Auth0 ID
// router.get('/:auth0_id', usersController.getUserByAuth0Id);

// 🆕 Register user
router.post("/register-user", usersController.registerUser);
router.get("/me/:auth0_id", usersController.getUserByAuth0Id);

router.get("/:id", usersController.getUserById);
// ✅ Complete onboarding
router.patch("/:id/complete-onboarding", usersController.completeOnboarding);

export default router;
