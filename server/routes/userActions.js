import express from "express";
import userActionsController from "../controllers/userActionsController.js";

const router = express.Router();

router.get("/:id/actions", userActionsController.getUserActions);
router.patch(
	"/:id/actions/:actionId",
	userActionsController.updateUserActionStatus
);

export default router;
