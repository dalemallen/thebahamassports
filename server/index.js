import express from 'express';
import rolesRouter from './routes/roles.js';
import { checkJwt, checkRole, logger } from './middleware/index.js';
import federationsRouter from './routes/federations.js';
import teamsRouter from './routes/teams.js';
import leaguesRouter from './routes/leagues.js';
import tournamentsRouter from './routes/tournaments.js';

const app = express();


app.use(express.json());
app.use(logger);

app.use('/api', rolesRouter);

app.use('/api/federations', federationsRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/leagues', leaguesRouter);
app.use('/api/tournaments', tournamentsRouter);

app.get('/api/coach-data', checkJwt, checkRole('coach'), (req, res) => {
  res.json({ message: 'Coach access granted' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
