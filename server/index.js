import express from "express";
import cors from "cors";
import { checkJwt, checkRole, logger } from "./middleware/index.js";

// 🧩 Routes
import rolesRouter from "./routes/roles.js";
import federationsRouter from "./routes/federations.js";
import teamsRouter from "./routes/teams.js";
import playerRoutes from "./routes/player.js";
import sportsRoutes from "./routes/sports.js";
import statsRoutes from "./routes/stats.js";
import eventRoutes from "./routes/events.js";
import mediaRoutes from "./routes/media.js";
import athletesRoutes from "./routes/athletes.js";
import leaguesRouter from "./routes/leagues.js";
import tournamentsRouter from "./routes/tournaments.js";
import usersRouter from "./routes/users.js";
import inviteRouter from "./routes/invites.js";
import announcementsRoutes from "./routes/announcements.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());
app.use(logger);

// ✅ Mount routes
app.use("/api/roles", rolesRouter);
app.use("/api/players", playerRoutes);
app.use("/api/teams", teamsRouter);
app.use("/api/federations", federationsRouter);
app.use("/api/sports", sportsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/athletes", athletesRoutes);
app.use("/api/leagues", leaguesRouter);
app.use("/api/tournaments", tournamentsRouter);
app.use("/api/users", usersRouter);
app.use("/api/invites", inviteRouter);
app.use("/api/announcements", announcementsRoutes);

// ✅ Example protected route
// app.get('/api/coach-data', checkJwt, checkRole('coach'), (req, res) => {
//   res.json({ message: 'Coach access granted' });
// });

app.listen(3000, () => console.log("Server running on port 3000"));
