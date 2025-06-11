import express from "express";
import {
  getAllLeagueMatches,
  getLeagueMatchById,
  createLeagueMatch,
  updateLeagueMatch,
  deleteLeagueMatch,
} from "../controllers/leagueMatchesController.js";

const router = express.Router();

router.get("/", getAllLeagueMatches);
router.get("/:id", getLeagueMatchById);
router.post("/", createLeagueMatch);
router.put("/:id", updateLeagueMatch);
router.delete("/:id", deleteLeagueMatch);

export default router;
